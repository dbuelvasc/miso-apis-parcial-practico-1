/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { ProductoEntity } from './../producto/producto.entity';
import { TiendaEntity } from './../tienda/tienda.entity';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let listaTiendas: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    listaTiendas = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "T " + i,
        ciudad: faker.string.alpha(3),
        direccion: faker.string.alpha(30),
      })
      listaTiendas.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.location.city(),
      precio: faker.number.int({ min: 100, max: 1000 }),
      tipo: "Perecedero",
      tiendas: listaTiendas
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addStoreToProduct', () => {
    // Error path
    it('raises an error if the store does not exist or its id is invalid when try to addStoreToProduct', async () => {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.location.city(),
        precio: faker.number.int({ min: 100, max: 1000 }),
        tipo: "Perecedero",
      })

      await expect(() => service.addStoreToProduct(producto.id, -1)).rejects.toHaveProperty("mensaje", "La tienda no existe");
    });

    it('raises an error if the product does not exist or its id is invalid when try to addStoreToProduct', async () => {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "tienda nueva",
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.string.alpha(30)
      });

      await expect(() => service.addStoreToProduct(-1, tienda.id)).rejects.toHaveProperty("mensaje", "El producto no existe");
    });

    // Happy path
    it('Adds a new store to an existing product when try to addStoreToProduct', async () => {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "tienda nueva",
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.string.alpha(30)
      });

      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.location.city(),
        precio: faker.number.int({ min: 100, max: 1000 }),
        tipo: "Perecedero",
      })

      const result: ProductoEntity = await service.addStoreToProduct(producto.id, tienda.id);

      expect(result.tiendas[0]).not.toBeNull();

      // basic fields validation
      expect(result.tiendas[0].nombre).toBe(tienda.nombre)
      expect(result.tiendas[0].ciudad).toBe(tienda.ciudad)
      expect(result.tiendas[0].direccion).toBe(tienda.direccion)

      // check if the list of stores is updated
      expect(result.tiendas.length).toBe(1);

    });
  });

  describe('findStoreFromProduct', () => {
    // Error path
    it('raises an error if the store does not exist or its id is invalid when try to findStoreFromProduct', async () => {
      await expect(() => service.findStoreFromProduct(producto.id, -1)).rejects.toHaveProperty("mensaje", "La tienda no existe");
    });

    it('raises an error if the product does not exist or its id is invalid when try to findStoreFromProduct', async () => {
      const tienda: TiendaEntity = listaTiendas[0];
      await expect(() => service.findStoreFromProduct(-1, tienda.id)).rejects.toHaveProperty("mensaje", "El producto no existe");
    });

    it('raises an error if the store is not associated to the product when try to findStoreFromProduct', async () => {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "tienda nueva",
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.string.alpha(30)
      });

      await expect(() => service.findStoreFromProduct(producto.id, tienda.id)).rejects.toHaveProperty("mensaje", "La tienda no esta asociada al producto");
    });

    // Happy path
    it('retuns the associated store to a product when try to findStoreFromProduct', async () => {
      const tienda: TiendaEntity = listaTiendas[0];
      const storeTienda: TiendaEntity = await service.findStoreFromProduct(producto.id, tienda.id,)
      expect(storeTienda).not.toBeNull();
      expect(storeTienda.nombre).toBe(tienda.nombre);

    });
  });

  describe('findStoresFromProduct', () => {
    // Error path
    it('raises an error if the product does not exist or its id is invalid when try to findStoresFromProduct', async () => {
      await expect(() => service.findStoresFromProduct(-1)).rejects.toHaveProperty("mensaje", "El producto no existe");
    });

    // Happy path
    it('returns the list of stores associated to a product when try to findStoresFromProduct', async () => {
      const tiendas: TiendaEntity[] = await service.findStoresFromProduct(producto.id);
      expect(tiendas.length).toBe(5)
    });
  });

  describe('updateStoresFromProduct', () => {
    // Error path
    it('raises an error if the product does not exist or its id is invalid when try to updateStoresFromProduct', async () => {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "tienda nueva",
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.string.alpha(30)
      });

      await expect(() => service.updateStoresFromProduct(-1, [tienda])).rejects.toHaveProperty("mensaje", "El producto no existe");
    });

    it('raises an error if the store does not exist or its id is invalid when try to updateStoresFromProduct', async () => {
      const tienda: TiendaEntity = listaTiendas[0];
      tienda.id = -1;

      await expect(() => service.updateStoresFromProduct(producto.id, [tienda])).rejects.toHaveProperty("mensaje", "La tienda no existe");
    });

    // Happy path
    it('success update the list of stores associated to a product when try to updateStoresFromProduct', async () => {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "tienda nueva",
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.string.alpha(30)
      });

      const productoStored: ProductoEntity = await service.updateStoresFromProduct(producto.id, [tienda]);
      expect(productoStored.tiendas.length).toBe(1);
      expect(productoStored.tiendas[0].nombre).toBe(tienda.nombre);

    });
  });

  describe('deleteStoreFromProduct', () => {
    // Error path  
    it('raises an error if the product does not exist or its id is invalid when try to deleteStoreFromProduct', async () => {
      await expect(() => service.deleteStoreFromProduct(producto.id, -1)).rejects.toHaveProperty("mensaje", "La tienda no existe");
    });

    it('raises an error if the store does not exist or its id is invalid when try to deleteStoreFromProduct', async () => {
      const tienda: TiendaEntity = listaTiendas[0];
      await expect(() => service.deleteStoreFromProduct(-1, tienda.id)).rejects.toHaveProperty("mensaje", "El producto no existe");
    });

    it('raises an error if the store is not associated to the product when try to deleteStoreFromProduct', async () => {
      const tienda: TiendaEntity = await tiendaRepository.save({
        nombre: "tienda nueva",
        ciudad: faker.location.countryCode('alpha-3'),
        direccion: faker.string.alpha(30)
      });

      await expect(() => service.deleteStoreFromProduct(producto.id, tienda.id)).rejects.toHaveProperty("mensaje", "La tienda no esta asociada al producto");
    });

    // Happy path
    it('success delete a store from a product when try to deleteStoreFromProduct', async () => {
      const tienda: TiendaEntity = listaTiendas[0];

      await service.deleteStoreFromProduct(producto.id, tienda.id);

      const storeProducto: ProductoEntity = await productoRepository.findOne({ where: { id: producto.id }, relations: ["tiendas"] });
      const deletedTienda: TiendaEntity = storeProducto.tiendas.find(object => object.id === tienda.id);

      expect(deletedTienda).toBeUndefined();

    });
  });
});
