import { Controller, Get } from '@nestjs/common';
import { OrderService } from '../order.service';
import { OrderDetailsService } from 'src/order-details/order-details.service';

@Controller('report')
export class ReportController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderDetailService: OrderDetailsService,
  ) {}

  @Get('best-selling-products')
  bestSellingProducts() {
    return this.orderDetailService.bestSeller();
  }

  @Get('client-with-most-orders')
  clientWithMostOrders() {
    return this.orderService.clientWithMostOrders();
  }

  @Get('highest-stock-per-warehouse')
  highestStockPerWarehouse() {
    return this.orderDetailService.highestStockPerWarehouse();
  }
}
