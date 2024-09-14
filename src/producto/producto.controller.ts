import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';

@Controller('products')
@UseInterceptors(ErroresNegocioInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  async findOne(@Param('productoId') productoId: number) {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  async update(
    @Param('productoId') productoId: number,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: number) {
    return await this.productoService.delete(productoId);
  }
}
