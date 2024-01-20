import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import * as shortid from 'shortid';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'varchar', length: 10, unique: true })
  number: string;

  // @BeforeInsert()
  // generateUic() {
  //   this.number = shortid.generate();
  // }
}
