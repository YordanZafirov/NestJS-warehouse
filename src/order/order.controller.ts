import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {}

  @Roles('OPERATOR')
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.orderService.create(createOrderDto);

    return order;
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.orderService.findOne(id);
  }

  @Roles('OPERATOR')
  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Roles('OWNER')
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.orderService.remove(id);
  }

  @Roles('OPERATOR')
  @Delete('soft-delete/:uuid')
  softDelete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.orderService.softDelete(id);
  }
}
