import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity/producto.entity';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    return this.productoRepository.findOneOrFail({ where: { id } });
  }

  async create(producto: Producto): Promise<Producto> {
    this.validateProductType(producto.tipo);
    return this.productoRepository.save(producto);
  }

  async update(id: number, producto: Producto): Promise<Producto> {
    this.validateProductType(producto.tipo);
    await this.productoRepository.update(id, producto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.productoRepository.delete(id);
  }

  private validateProductType(tipo: string): void {
    if (tipo !== 'Perecedero' && tipo !== 'No perecedero') {
      throw new BadRequestException('Tipo de producto inválido');
    }
  }
}