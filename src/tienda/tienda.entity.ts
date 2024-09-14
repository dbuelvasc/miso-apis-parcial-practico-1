import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Producto } from '../producto/producto.entity';

@Entity()
export class Tienda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ length: 3 })
  ciudad: string;

  @Column()
  direccion: string;

  @ManyToMany(() => Producto, producto => producto.tiendas)
  @JoinTable()
  productos: Producto[];
}