import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderDetailsService } from 'src/order-details/order-details.service';
import { OrderService } from '../order.service';

@Injectable()
export class ReportService {
  constructor(
    private readonly orderDetailService: OrderDetailsService,
    private readonly orderService: OrderService,
  ) {}
  async bestSellingProducts() {
    return await this.orderDetailService.bestSeller();
  }

  async clientWithMostOrders() {
    return await this.orderService.clientWithMostOrders();
  }

  async highestStockPerWarehouse() {
    return await this.orderDetailService.highestStockPerWarehouse();
  }
}
