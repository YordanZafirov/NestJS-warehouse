import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, TransferType } from './entities/order.entity';
import { Not, Repository } from 'typeorm';
import { ClientService } from 'src/client/client.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { OrderDetailsService } from 'src/order-details/order-details.service';
import { ProductService } from 'src/product/product.service';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { InvoiceService } from 'src/invoice/invoice.service';
import { Client } from 'src/client/entities/client.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    private readonly clientService: ClientService,
    private readonly warehouseService: WarehouseService,
    @Inject(forwardRef(() => OrderDetailsService))
    private readonly orderDetailsService: OrderDetailsService,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async findAll() {
    const orders = await this.orderRepository.find({ loadRelationIds: true });
    return orders;
  }

  async findOne(id: string, options?: { relations?: string[] }) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: options?.relations || [],
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return order;
    } catch (error) {
      throw new NotFoundException(error.message || 'Failed to save order');
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      // Fetch related entities using their services
      const client = await this.clientService.findOne(createOrderDto.clientId);
      const warehouse = await this.warehouseService.findOne(
        createOrderDto.warehouseId,
      );

      let outgoingWarehouse: Warehouse | undefined;

      if (createOrderDto.type === 'delivery') {
        if (createOrderDto.outgoingWarehouse) {
          throw new BadRequestException(
            'Outgoing warehouse is not allowed for delivery orders',
          );
        }
      } else {
        outgoingWarehouse = await this.transferFunctionality(
          createOrderDto,
          this.warehouseService,
          warehouse,
        );
      }

      if (!client || !warehouse) {
        throw new NotFoundException('Client or Warehouse not found');
      }

      // Create the order
      const order = await this.orderRepository.save({
        clientId: client,
        warehouseId: warehouse,
        outgoingWarehouseId: outgoingWarehouse,
        type: createOrderDto.type,
      });

      // Create corresponding OrderDetails
      const orderDetails = [];
      for (const orderDetail of createOrderDto.product) {
        const product = await this.productService.findOne(
          orderDetail.productId,
        );

        if (createOrderDto.type === 'delivery') {
          if (warehouse.type !== product.type) {
            throw new BadRequestException(
              'Product type must match warehouse type for delivery',
            );
          }
        }
        const detail = await this.orderDetailsService.create({
          orderId: order.id,
          productId: orderDetail.productId,
          quantity: orderDetail.quantity,
          unitPrice: orderDetail.unitPrice,
        });

        orderDetails.push(detail);
      }

      if (createOrderDto.type === 'stock picking') {
        await this.invoiceService.create({
          orderId: order.id,
        });
      }

      const { id: clientId } = client;
      const { id: warehouseId } = warehouse;
      const { id } = order;

      return { id, clientId, warehouseId, orderDetails };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new NotFoundException(error.message || 'Failed to save order');
      }
    }
  }

  async update(orderId: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(orderId);

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Update order properties if provided in the DTO
      if (updateOrderDto.clientId) {
        const client = await this.clientService.findOne(
          updateOrderDto.clientId,
        );
        if (!client) {
          throw new NotFoundException('Client not found');
        }
        order.clientId = client;
      }

      if (updateOrderDto.warehouseId) {
        const warehouse = await this.warehouseService.findOne(
          updateOrderDto.warehouseId,
        );
        if (!warehouse || warehouse.deletedAt) {
          throw new NotFoundException('Warehouse not found');
        }
        order.warehouseId = warehouse;
      }

      if (updateOrderDto.outgoingWarehouse) {
        const outgoingWarehouse = await this.warehouseService.findOne(
          updateOrderDto.outgoingWarehouse,
        );
        if (!outgoingWarehouse) {
          throw new NotFoundException('Outgoing Warehouse not found');
        }
        order.outgoingWarehouseId = outgoingWarehouse;
      }

      // Save the updated order
      const updatedOrder = await this.orderRepository.save(order);
      const orderDetails = [];
      for (const orderDetail of updateOrderDto.product) {
        const detail = await this.orderDetailsService.update(
          orderId,
          orderDetail,
        );
        orderDetails.push(detail);
      }

      return { order: updatedOrder, orderDetails };
    } catch (error) {
      throw new NotFoundException(error.message || 'Failed to update order');
    }
  }

  async remove(id: string) {
    try {
      const order = await this.findOne(id, { relations: ['orderDetails'] });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      await Promise.all(
        order.orderDetails.map(async (orderDetail) => {
          await this.orderDetailRepository.remove(orderDetail);
        }),
      );

      await this.invoiceService.remove(id);

      const removdeOrder = await this.orderRepository.remove(order);
      if (removdeOrder) {
        return { message: 'Order removed' };
      }
    } catch (error) {
      throw new NotFoundException(error.message || 'Failed to remove order');
    }
  }

  async softDelete(id: string) {
    try {
      const order = await this.findOne(id, { relations: ['orderDetails'] });

      if (!order) {
        throw new NotFoundException('Order not found or already deleted');
      }

      await Promise.all(
        order.orderDetails.map(async (orderDetail) => {
          await this.orderDetailRepository.softRemove(orderDetail);
        }),
      );

      await this.invoiceService.softDelete(id);

      const removdeOrder = await this.orderRepository.softRemove(order);
      if (removdeOrder) {
        return { message: 'Order removed' };
      }
    } catch (error) {
      throw new NotFoundException(error.message || 'Failed to remove order');
    }
  }

  async clientWithMostOrders() {
    const query = await this.orderRepository
      .createQueryBuilder('order')
      .select(['COUNT(order.id) AS orders', 'client.accountable_person'])
      .innerJoin(Client, 'client', 'order.client_id = client.id')
      // .where('order.type = :type', { type: 'stock picking' })
      .where('order.deleted_at IS NULL')
      .groupBy('client.accountable_person')
      .orderBy('orders', 'DESC')
      .limit(1)
      .getRawMany();

    return query;
  }

  private transferFunctionality = async (
    createOrderDto: CreateOrderDto,
    warehouseService: WarehouseService,
    warehouse: Warehouse,
  ): Promise<Warehouse | undefined> => {
    let outgoingWarehouse: Warehouse | undefined;

    if (createOrderDto.type === 'transfer') {
      if (!createOrderDto.outgoingWarehouse) {
        throw new BadRequestException(
          'Outgoing warehouse is required for transfer orders',
        );
      }

      outgoingWarehouse = await warehouseService.findOne(
        createOrderDto.outgoingWarehouse,
      );

      if (!outgoingWarehouse || outgoingWarehouse.deletedAt) {
        throw new BadRequestException(
          'Outgoing warehouse not found or deleted for transfer',
        );
      }

      if (warehouse.id === outgoingWarehouse.id) {
        throw new BadRequestException(
          'Warehouse and Outgoing Warehouse cannot be the same for transfer orders',
        );
      }

      if (warehouse.type !== outgoingWarehouse.type) {
        throw new BadRequestException(
          'Warehouse and Outgoing Warehouse must have the same type for transfer orders',
        );
      }
    }

    return outgoingWarehouse;
  };
}
