import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto/producto.entity';
import { ProductoModule } from './producto/producto.module';
import { TiendaEntity } from './tienda/tienda.entity';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoService } from './producto/producto.service';
import { TiendaService } from './tienda/tienda.service';
import { ProductoTiendaService } from './producto-tienda/producto-tienda.service';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { ProductoTiendaService } from './producto-tienda/producto-tienda.service';

const db_host = process.env.DB_HOST || 'localhost';
const db_port = parseInt(process.env.DB_PORT, 10) || 5432
const db_username = process.env.DB_USERNAME || 'postgres';
const db_password = process.env.DB_PASSWORD || 'postgres';
const db_database = process.env.DB_DATABASE || 'postgres';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: db_host,
      port: db_port,
      username: db_username,
      password: db_password,
      database: db_database,
      synchronize: true,
      dropSchema: true,
      keepConnectionAlive: true,
      entities: [ProductoEntity, TiendaEntity],
    }),
    ProductoModule,
    TiendaModule,
    ProductoTiendaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProductoService, TiendaService, ProductoTiendaService],
})
export class AppModule { }