/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaController } from './tienda.controller';

@Module({
  providers: [TiendaService, TiendaEntity],
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  exports: [TiendaEntity,TypeOrmModule.forFeature([TiendaEntity])],
  controllers: [TiendaController]
})
export class TiendaModule {}
