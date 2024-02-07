import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { OrderDetailsService } from './order-details.service';
import { OrderDetail } from './entities/order-detail.entity';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Get()
  async findAll() {
    const orderDetails: OrderDetail[] =
      await this.orderDetailsService.findAll();

    // Format the response to include the required information
    const formattedOrderDetails = orderDetails.map((orderDetail) => ({
      id: orderDetail.id,
      quantity: orderDetail.quantity,
      unitPrice: orderDetail.unitPrice,
      createdAt: orderDetail.createdAt,
      updatedAt: orderDetail.updatedAt,
      productId: orderDetail.productId,
      orderId: orderDetail.orderId,
    }));

    return formattedOrderDetails;
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.orderDetailsService.findOne(id);
  }

  @Get('order/:orderId')
  async findByOrderId(@Param('orderId', new ParseUUIDPipe()) orderId: string) {
    return await this.orderDetailsService.findByOrderId(orderId);
  }
}
