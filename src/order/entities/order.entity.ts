import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Client } from '../../client/entities/client.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';

export enum TransferType {
  Delivery = 'delivery',
  StockPicking = 'stock picking',
  Transfer = 'transfer',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: TransferType })
  type: TransferType;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.orders)
  @JoinColumn({ name: 'warehouse_id' })
  warehouseId: Warehouse;

  @ManyToOne(() => Warehouse, { nullable: true }) // Make it nullable
  @JoinColumn({ name: 'outgoing_warehouse_id' })
  outgoingWarehouseId?: Warehouse;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.orderId, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  orderDetails: OrderDetail[]; 

  @OneToMany(()=> Invoice, (invoice) => invoice.order, {  
    cascade: true,
    onDelete: 'CASCADE',
  })
  invoices: Invoice[];

  @ManyToOne(() => Client, (client) => client.orders)
  @JoinColumn({ name: 'client_id' })
  clientId: Client;

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
