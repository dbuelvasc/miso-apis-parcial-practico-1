/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TiendaEntity } from './tienda.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>,
  ) { }

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({ relations: ['productos'] });
  }

  async findOne(id: number): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id }, relations: ['productos'],
    });
    if (!tienda)
      throw new ExcepcionNegocio(
        'Tienda no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    // validaciones de negocio
    if (!tienda || !tienda.ciudad || tienda.ciudad.length !== 3) {
        throw new ExcepcionNegocio("La ciudad de la tienda debe ser un codigo de 3 digitos", ErrorNegocio.PRECONDITION_FAILED);
    }
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: number, tienda: TiendaEntity): Promise<TiendaEntity> {
    // validaciones de negocio
    if (!tienda || !tienda.ciudad || tienda.ciudad.length !== 3) {
        throw new ExcepcionNegocio("La ciudad de la tienda debe ser un codigo de 3 digitos", ErrorNegocio.PRECONDITION_FAILED);
    }
    const tiendaPersistida: TiendaEntity =
      await this.tiendaRepository.findOne({
        where: { id },
      });
    if (!tiendaPersistida)
      throw new ExcepcionNegocio(
        'Tienda no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    return await this.tiendaRepository.save({
      ...tiendaPersistida,
      ...tienda,
    });
  }

  async delete(id: number) {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({
      where: { id },
    });
    if (!tienda)
      throw new ExcepcionNegocio(
        'Tienda no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    await this.tiendaRepository.remove(tienda);
  }
}
