/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoEntity } from './../producto/producto.entity';
import { TiendaEntity } from './../tienda/tienda.entity';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class ProductoTiendaService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,

        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) { }

    async addStoreToProduct(idProducto: number, idTienda: number): Promise<ProductoEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: idTienda } });
        if (!tienda)
            throw new ExcepcionNegocio("La tienda no existe", ErrorNegocio.NOT_FOUND);

        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: idProducto }, relations: ["tiendas"] })
        if (!producto)
            throw new ExcepcionNegocio("El producto no existe", ErrorNegocio.NOT_FOUND);

        producto.tiendas = [...producto.tiendas, tienda];
        return await this.productoRepository.save(producto);
    }


    async findStoresFromProduct(idProducto: number): Promise<TiendaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: idProducto }, relations: ["tiendas"] });
        if (!producto)
            throw new ExcepcionNegocio("El producto no existe", ErrorNegocio.NOT_FOUND)

        return producto.tiendas;
    }

    async findStoreFromProduct(idProducto: number, idTienda: number): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: idTienda } });
        if (!tienda)
            throw new ExcepcionNegocio("La tienda no existe", ErrorNegocio.NOT_FOUND)

        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: idProducto }, relations: ["tiendas"] });
        if (!producto)
            throw new ExcepcionNegocio("El producto no existe", ErrorNegocio.NOT_FOUND)

        const tiendas: TiendaEntity = producto.tiendas.find(object => object.id === tienda.id);

        if (!tiendas)
            throw new ExcepcionNegocio("La tienda no esta asociada al producto", ErrorNegocio.PRECONDITION_FAILED)

        return tiendas;
    }



    async updateStoresFromProduct(idProducto: number, tiendas: TiendaEntity[]): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: idProducto }, relations: ["tiendas"] });

        if (!producto)
            throw new ExcepcionNegocio("El producto no existe", ErrorNegocio.NOT_FOUND)

        for (let i = 0; i < tiendas.length; i++) {
            const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: tiendas[i].id } });
            if (!tienda)
                throw new ExcepcionNegocio("La tienda no existe", ErrorNegocio.NOT_FOUND)
        }

        producto.tiendas = tiendas;
        return await this.productoRepository.save(producto);
    }

    async deleteStoreFromProduct(idProducto: number, idTienda: number) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id: idTienda } });
        if (!tienda)
            throw new ExcepcionNegocio("La tienda no existe", ErrorNegocio.NOT_FOUND)

        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { id: idProducto }, relations: ["tiendas"] });
        if (!producto)
            throw new ExcepcionNegocio("El producto no existe", ErrorNegocio.NOT_FOUND)

        const tiendas: TiendaEntity = producto.tiendas.find(object => object.id === tienda.id);

        if (!tiendas)
            throw new ExcepcionNegocio("La tienda no esta asociada al producto", ErrorNegocio.PRECONDITION_FAILED)

        producto.tiendas = producto.tiendas.filter(e => e.id !== idTienda);
        await this.productoRepository.save(producto);
    }
}