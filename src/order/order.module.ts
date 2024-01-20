import { Module, forwardRef } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Client } from 'src/client/entities/client.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { ClientModule } from 'src/client/client.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { OrderDetailsModule } from 'src/order-details/order-details.module';
import { ProductModule } from 'src/product/product.module';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { InvoiceModule } from 'src/invoice/invoice.module';
import { ReportModule } from './report/report.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Client, Warehouse, OrderDetail]),
    ClientModule,
    WarehouseModule,
    forwardRef(()=>OrderDetailsModule),
    forwardRef(()=>ProductModule),
    InvoiceModule,
    ReportModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
