import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('best-selling-products')
  bestSellingProducts() {
    return this.reportService.bestSellingProducts();
  }

  @Get('client-with-most-orders')
  clientWithMostOrders() {
    return this.reportService.clientWithMostOrders();
  }

  @Get('highest-stock-per-warehouse')
  highestStockPerWarehouse() {
    return this.reportService.highestStockPerWarehouse();
  }
}
