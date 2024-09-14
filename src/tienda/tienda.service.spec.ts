/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { faker } from '@faker-js/faker';
import { TiendaService } from './tienda.service';
import { TiendaEntity } from './tienda.entity';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let storesList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(
      getRepositoryToken(TiendaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    storesList = [];
    for (let i = 0; i < 5; i++) {
      const store: TiendaEntity = await repository.save({
        nombre: faker.word.noun(),
        ciudad: faker.word.interjection(3),
        direccion: faker.lorem.paragraphs(2),
        productos: [],
      });
      storesList.push(store);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all products', async () => {
    const stores: TiendaEntity[] = await service.findAll();
    expect(stores).not.toBeNull();
    expect(stores).toHaveLength(storesList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: TiendaEntity = storesList[0];
    const store: TiendaEntity = await service.findOne(storedProduct.id);
    expect(store).not.toBeNull();
    expect(store.nombre).toEqual(storedProduct.nombre);
    expect(store.ciudad).toEqual(storedProduct.ciudad);
    expect(store.direccion).toEqual(storedProduct.direccion);
  });

  it('findOne should throw an exception for an invalid store', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'mensaje',
      'Tienda no encontrada',
    );
  });

  it('create should return a new store', async () => {
    const store: TiendaEntity = {
      id: 0,
      nombre: faker.word.noun(),
      ciudad: faker.word.interjection(3),
      direccion: faker.lorem.paragraphs(2),
      productos: [],
    };

    const newStore: TiendaEntity = await service.create(store);
    expect(newStore).not.toBeNull();

    const createdStore: TiendaEntity = await repository.findOne({
      where: { id: newStore.id },
    });
    expect(createdStore).not.toBeNull();
    expect(createdStore.nombre).toEqual(newStore.nombre);
    expect(createdStore.ciudad).toEqual(newStore.ciudad);
    expect(createdStore.direccion).toEqual(newStore.direccion);
  });

  it('create should throw an exception for an invalid store - bad ciudad', async () => {
    const store: TiendaEntity = {
      id: 0,
      nombre: faker.word.noun(),
      ciudad: faker.word.interjection(4),
      direccion: faker.lorem.paragraphs(2),
      productos: [],
    };

    await expect(() => service.create(store)).rejects.toHaveProperty(
      'mensaje',
      'La ciudad de la tienda debe ser un codigo de 3 digitos',
    );
  });

  it('update should modify a store', async () => {
    const store: TiendaEntity = storesList[0];
    store.nombre = 'Wonderland';
    store.ciudad = 'MED';
    store.direccion = 'The rabbit created with magic and imagination';
    const updatedStore: TiendaEntity = await service.update(
      store.id,
      store,
    );
    expect(updatedStore).not.toBeNull();
    const createdStore: TiendaEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(createdStore).not.toBeNull();
    expect(createdStore.nombre).toEqual(store.nombre);
    expect(createdStore.ciudad).toEqual(store.ciudad);
    expect(createdStore.direccion).toEqual(store.direccion);
  });

  it('update should throw an exception for an invalid store', async () => {
    let store: TiendaEntity = storesList[0];
    store = {
      ...store,
      nombre: 'Wonderland 2',
      ciudad: 'MED',
      direccion: 'This was created by the queen of hearts',
    };
    await expect(() => service.update(0, store)).rejects.toHaveProperty(
      'mensaje',
      'Tienda no encontrada',
    );
  });

  it('update should throw an exception for an invalid store - bad ciudad', async () => {
    let store: TiendaEntity = storesList[0];
    store = {
      ...store,
      nombre: 'Wonderland 2',
      ciudad: 'MED2',
      direccion: 'This was created by the queen of hearts',
    };
    await expect(() => service.update(store.id, store)).rejects.toHaveProperty(
      'mensaje',
      'La ciudad de la tienda debe ser un codigo de 3 digitos',
    );
  });

  it('delete should remove a store', async () => {
    const store: TiendaEntity = storesList[0];
    await service.delete(store.id);
    const deletedStore: TiendaEntity = await repository.findOne({
      where: { id: store.id },
    });
    expect(deletedStore).toBeNull();
  });

  it('delete should throw an exception for an invalid store', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'mensaje',
      'Tienda no encontrada',
    );
  });
});