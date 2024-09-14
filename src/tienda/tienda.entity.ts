/* eslint-disable prettier/prettier */
import { ProductoEntity } from '../producto/producto.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, } from 'typeorm';

@Entity()
export class TiendaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @ManyToMany(() => ProductoEntity, (productoEntity) => productoEntity.tiendas)
  productos: ProductoEntity[];
}

