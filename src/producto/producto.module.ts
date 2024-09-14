import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  providers: [ProductoService],
  exports: [ProductoService]
})

