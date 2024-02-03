import { Module, forwardRef } from '@nestjs/common';
import { OrderModule } from '../order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { ReportController } from './report.controller';
import { OrderDetailsModule } from 'src/order-details/order-details.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail, Product]),
    forwardRef(() => OrderModule),
    OrderDetailsModule,
  ],
  controllers: [ReportController],
})
export class ReportModule {}
