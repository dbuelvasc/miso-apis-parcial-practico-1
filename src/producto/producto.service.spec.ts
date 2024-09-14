/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { faker } from '@faker-js/faker';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productsList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductoEntity = await repository.save({
        nombre: faker.word.noun(),
        precio: faker.number.int(),
        tipo: "Perecedero",
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const products: ProductoEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductoEntity = productsList[0];
    const product: ProductoEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.nombre).toEqual(storedProduct.nombre);
    expect(product.precio).toEqual(storedProduct.precio);
    expect(product.tipo).toEqual(storedProduct.tipo);
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'mensaje',
      'Producto no encontrado',
    );
  });

  it('create should return a new product', async () => {
    const product: ProductoEntity = {
      id: 0,
      nombre: faker.word.noun(),
      precio: faker.number.int(),
      tipo: "No perecedero",
      tiendas: [],
    };

    const newProduct: ProductoEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductoEntity = await repository.findOne({
      where: { id: newProduct.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(newProduct.nombre);
    expect(storedProduct.precio).toEqual(newProduct.precio);
    expect(storedProduct.tipo).toEqual(newProduct.tipo);
  });

  it('create should throw an exception for an invalid product', async () => {
    const product: ProductoEntity = {
      id: 0,
      nombre: faker.word.noun(),
      precio: faker.number.int(),
      tipo: "No perecedero",
      tiendas: [],
    };

    await expect(() => service.create({ ...product, tipo: "Invalido" })).rejects.toHaveProperty(
      'mensaje',
      'El tipo del producto no se encuentra en los permitidos',
    );
  });

  it('update should modify a product', async () => {
    const product: ProductoEntity = productsList[0];
    product.nombre = 'Wonderland';
    product.precio = 666;
    product.tipo = "No perecedero";
    const updatedProduct: ProductoEntity = await service.update(
      product.id,
      product,
    );
    expect(updatedProduct).not.toBeNull();
    const storedProduct: ProductoEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.nombre).toEqual(product.nombre);
    expect(storedProduct.precio).toEqual(product.precio);
    expect(storedProduct.tipo).toEqual(product.tipo);
  });

  it('update should throw an exception for an invalid product', async () => {
    const product: ProductoEntity = productsList[0];
    product.nombre = 'Wonderland';
    product.precio = 666;
    product.tipo = "Invalido";
    await expect(() => service.update(product.id, product)).rejects.toHaveProperty(
      'mensaje',
      'El tipo del producto no se encuentra en los permitidos',
    );
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductoEntity = productsList[0];
    product = {
      ...product,
      nombre: 'Wonderland 2',
      precio: 666,
      tipo: "No perecedero",
    };
    await expect(() => service.update(0, product)).rejects.toHaveProperty(
      'mensaje',
      'Producto no encontrado',
    );
  });

  it('delete should remove a product', async () => {
    const product: ProductoEntity = productsList[0];
    await service.delete(product.id);
    const deletedProduct: ProductoEntity = await repository.findOne({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'mensaje',
      'Producto no encontrado',
    );
  });
});
