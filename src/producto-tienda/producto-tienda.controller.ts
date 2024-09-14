/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaEntity } from './../tienda/tienda.entity';
import { TiendaDto } from './../tienda/tienda.dto';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';


@Controller('products')
@UseInterceptors(ErroresNegocioInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService) { }

    @Post(':idProducto/stores/:idTienda')
    async addStoreToProduct(@Param('idProducto') idProducto: number, @Param('idTienda') idTienda: number) {
        return await this.productoTiendaService.addStoreToProduct(idProducto, idTienda);
    }

    @Get(':idProducto/stores')
    async findStoresFromProduct(@Param('idProducto') idProducto: number) {
        return await this.productoTiendaService.findStoresFromProduct(idProducto);
    }

    @Get(':idProducto/stores/:idTienda')
    async findStoreFromProduct(@Param('idProducto') idProducto: number, @Param('idTienda') idTienda: number) {
        return await this.productoTiendaService.findStoreFromProduct(idProducto, idTienda);
    }

    @Put(':idProducto/stores')
    async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('idProducto') idProducto: number) {
        const tiendas = plainToInstance(TiendaEntity, tiendasDto)
        return await this.productoTiendaService.updateStoresFromProduct(idProducto, tiendas);
    }

    @Delete(':idProducto/stores/:idTienda')
    @HttpCode(204)
    async deleteStoreFromProduct(@Param('idProducto') idProducto: number, @Param('idTienda') idTienda: number) {
        return await this.productoTiendaService.deleteStoreFromProduct(idProducto, idTienda);
    }
}