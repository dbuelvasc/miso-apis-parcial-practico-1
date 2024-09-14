/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class ProductoService {

  tiposPermitidos: string[] = ["Perecedero", "No perecedero"];

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) { }

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({ relations: ['tiendas'] });
  }

  async findOne(id: number): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id }, relations: ['tiendas'],
    });
    if (!producto)
      throw new ExcepcionNegocio(
        'Producto no encontrado',
        ErrorNegocio.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    // validaciones de negocio
    if (!producto || !this.tiposPermitidos.includes(producto.tipo)) {
      throw new ExcepcionNegocio("El tipo del producto no se encuentra en los permitidos", ErrorNegocio.PRECONDITION_FAILED);
    }
    return await this.productoRepository.save(producto);
  }

  async update(id: number, producto: ProductoEntity): Promise<ProductoEntity> {
    // validaciones de negocio
    if (!producto || !this.tiposPermitidos.includes(producto.tipo)) {
      throw new ExcepcionNegocio("El tipo del producto no se encuentra en los permitidos", ErrorNegocio.PRECONDITION_FAILED);
    }
    const productoPersistido: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!productoPersistido)
      throw new ExcepcionNegocio(
        'Producto no encontrado',
        ErrorNegocio.NOT_FOUND,
      );

    return await this.productoRepository.save({
      ...productoPersistido,
      ...producto,
    });
  }

  async delete(id: number) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new ExcepcionNegocio(
        'Producto no encontrado',
        ErrorNegocio.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
