import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ItemType {
  solid = 'solid',
  liquid = 'liquid',
}

export enum UnitType {
  KILOGRAM = 'kg',
  LITER = 'L',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UnitType, name: 'unit_type' })
  unitType: string;

  @Column({ type: 'enum', enum: ItemType })
  type: ItemType;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
