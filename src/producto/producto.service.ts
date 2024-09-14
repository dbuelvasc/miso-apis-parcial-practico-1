import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Tienda } from '../tienda/tienda.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column()
  tipo: string;

  @ManyToMany(() => Tienda, tienda => tienda.productos)
  tiendas: Tienda[];
}