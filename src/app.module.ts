import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from 'db/data-source';
import { ClientModule } from './client/client.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { OrderModule } from './order/order.module';
import { InvoiceModule } from './invoice/invoice.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRoot(dataSourceOptions),
    ClientModule,
    WarehouseModule,
    OrderModule,
    InvoiceModule,
    OrderDetailsModule,
    ProductModule,
    UserModule,
  ],
})
export class AppModule {}
