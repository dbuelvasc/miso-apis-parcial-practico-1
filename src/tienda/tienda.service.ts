import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tienda } from './tienda.entity';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(Tienda)
    private tiendaRepository: Repository<Tienda>,
  ) {}

  async findAll(): Promise<Tienda[]> {
    return this.tiendaRepository.find();
  }

  async findOne(id: number): Promise<Tienda> {
    return this.tiendaRepository.findOneOrFail({ where: { id } });
  }

  async create(tienda: Tienda): Promise<Tienda> {
    this.validateCityCode(tienda.ciudad);
    return this.tiendaRepository.save(tienda);
  }

  async update(id: number, tienda: Tienda): Promise<Tienda> {
    this.validateCityCode(tienda.ciudad);
    await this.tiendaRepository.update(id, tienda);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.tiendaRepository.delete(id);
  }

  private validateCityCode(ciudad: string): void {
    if (ciudad.length !== 3) {
      throw new BadRequestException('El código de ciudad debe tener 3 caracteres');
    }
  }
}