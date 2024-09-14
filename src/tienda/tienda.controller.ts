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
import { TiendaService } from './tienda.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { TiendaDto } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';
import { plainToInstance } from 'class-transformer';

@Controller('stores')
@UseInterceptors(ErroresNegocioInterceptor)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Get()
  async findAll() {
    return await this.tiendaService.findAll();
  }

  @Get(':tiendaId')
  async findOne(@Param('tiendaId') tiendaId: number) {
    return await this.tiendaService.findOne(tiendaId);
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(
      TiendaEntity,
      tiendaDto,
    );
    return await this.tiendaService.create(tienda);
  }

  @Put(':tiendaId')
  async update(
    @Param('tiendaId') tiendaId: number,
    @Body() tiendaDto: TiendaDto,
  ) {
    const tienda: TiendaEntity = plainToInstance(
      TiendaEntity,
      tiendaDto,
    );
    return await this.tiendaService.update(tiendaId, tienda);
  }

  @Delete(':tiendaId')
  @HttpCode(204)
  async delete(@Param('tiendaId') tiendaId: number) {
    return await this.tiendaService.delete(tiendaId);
  }
}
