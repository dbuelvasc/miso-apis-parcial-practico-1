/* eslint-disable prettier/prettier */
import { TiendaEntity } from '../tienda/tienda.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable} from 'typeorm';

@Entity()
export class ProductoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  precio: number;

  @Column()
  tipo: string;

  @ManyToMany(() => TiendaEntity, (tiendaEntity) => tiendaEntity.productos)
  @JoinTable()
  tiendas: TiendaEntity[];
}
