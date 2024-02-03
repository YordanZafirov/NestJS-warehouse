import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductType {
  SOLID = 'solid',
  LIQUID = 'liquid',
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

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
