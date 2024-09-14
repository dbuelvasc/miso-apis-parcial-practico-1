/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoController } from './producto.controller';

@Module({
  providers: [ProductoService, ProductoEntity],
  imports: [TypeOrmModule.forFeature([ProductoEntity])],
  exports: [ProductoEntity,TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductoController]
})
export class ProductoModule {}
