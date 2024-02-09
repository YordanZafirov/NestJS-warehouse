import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<OrderDetail[]> {
    return await this.orderDetailRepository.find({
      relations: ['productId', 'orderId'],
    });
  }

  async findOne(id: string): Promise<OrderDetail> {
    try {
      const orderDetail = await this.orderDetailRepository.findOneBy({ id });

      if (!orderDetail) {
        throw new NotFoundException('OrderDetail not found');
      }

      return orderDetail;
    } catch (error) {
      throw new NotFoundException(
        error.message || 'Failed to find order detail',
      );
    }
  }

  async findByOrderId(orderId: string): Promise<OrderDetail[]> {
    try {
      const orderDetails = await this.orderDetailRepository.find({
        where: { orderId: { id: orderId } },
        relations: ['productId', 'orderId'],
      });

      if (!orderDetails) {
        throw new NotFoundException('OrderDetail not found');
      }

      return orderDetails;
    } catch (error) {
      throw new NotFoundException(
        error.message || 'Failed to find order detail',
      );
    }
  }

  async create(orderDetailDto: CreateOrderDetailDto): Promise<OrderDetail> {
    try {
      const { orderId, productId, quantity, unitPrice } = orderDetailDto;

      if (!productId) {
        throw new BadRequestException('Product id is required');
      } else if (!quantity) {
        throw new BadRequestException('Quantity is required');
      } else if (!unitPrice) {
        throw new BadRequestException('Unit price is required');
      }

      if (
        quantity <= 0 ||
        isNaN(quantity) ||
        unitPrice <= 0 ||
        isNaN(unitPrice)
      ) {
        throw new BadRequestException('Invalid quantity or unit price');
      }

      if (quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      } else if (quantity !== Number(quantity)) {
        throw new BadRequestException('Quantity must be a number');
      } else if (unitPrice !== Number(unitPrice)) {
        throw new BadRequestException('Unit price must be a number');
      } else if (unitPrice <= 0) {
        throw new BadRequestException('Unit price must be greater than 0');
      }

      const product = await this.productRepository.findOne({
        where: { id: productId },
      });

      const orderDetail = this.orderDetailRepository.create({
        orderId: { id: orderId },
        productId: product,
        quantity,
        unitPrice,
      });

      return await this.orderDetailRepository.save(orderDetail);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to save order detail',
      );
    }
  }

  async update(
    orderId: string,
    updateOrderDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail> {
    try {
      const orderDetail = await this.findOne(orderId);

      Object.assign(orderDetail, {
        orderId: { id: orderId },
        productId: { id: updateOrderDto.productId },
        quantity: updateOrderDto.quantity,
        unitPrice: updateOrderDto.unitPrice,
      });

      return await this.orderDetailRepository.save(orderDetail);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update order detail',
      );
    }
  }

  async bestSeller() {
    const query = await this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .select([
        'SUM(orderDetail.quantity) AS best_selling',
        'product.name AS product_name',
      ])
      .innerJoin(Order, 'order', 'orderDetail.order_id = order.id')
      .innerJoin(Product, 'product', 'orderDetail.product_id = product.id')
      .where('order.type = :type', { type: 'stock picking' })
      .andWhere('order.deleted_at IS NULL')
      .groupBy('product.name')
      .addGroupBy('orderDetail.quantity')
      .orderBy('best_selling', 'DESC')
      .limit(1)
      .getRawMany();

    return query;
  }

  async highestStockPerWarehouse() {
    const sql = `
    SELECT 
    max_quantity,
    product_name,
    warehouse_name
FROM (
    SELECT 
        MAX(od.quantity) AS max_quantity,
        p.name AS product_name,
        w.name AS warehouse_name,
        ROW_NUMBER() OVER(PARTITION BY w.name ORDER BY MAX(od.quantity) DESC) AS row_num
    FROM 
        order_detail od
    JOIN 
        product p ON od.product_id = p.id
    JOIN 
        "order" o ON od.order_id = o.id
    JOIN 
        warehouse w ON o.warehouse_id = w.id
    WHERE 
        o.deleted_at IS NULL
    GROUP BY 
        p.name, w.name
) AS subquery
WHERE 
    row_num = 1
ORDER BY 
    max_quantity DESC;
    `;

    const query = await this.orderDetailRepository.query(sql);
    return query;
  }
}
