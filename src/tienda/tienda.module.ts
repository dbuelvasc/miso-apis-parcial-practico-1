import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaService } from './tienda.service';
import { Tienda } from './tienda.entity';
// import { TiendaController } from './tienda.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tienda])],
  providers: [TiendaService],
  // controllers: [TiendaController],
  exports: [TiendaService]
})
export class TiendaModule {}
