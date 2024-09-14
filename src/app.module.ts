import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TiendaModule } from './tienda/tienda.module';

@Module({
  imports: [TiendaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
