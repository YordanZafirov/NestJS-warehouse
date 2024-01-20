import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as shortid from 'shortid';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'accountable_person' })
  accountablePerson: string;

  @Column({ name: 'user_name' })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @OneToMany(() => Order, (order) => order.clientId)
  orders: Order[];

  @Column({ type: 'varchar', length: 10, unique: true })
  uic: string;

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

  @BeforeInsert()
  generateUic() {
    this.uic = shortid.generate();
  }
}
