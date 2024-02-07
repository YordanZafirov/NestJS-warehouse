import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';
import * as shortid from 'shortid';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const order: Order = await this.orderRepository.findOneBy({
      id: createInvoiceDto.orderId,
    });

    if (!order) {
      // Handle the case where the order is not found
      throw new NotFoundException('Order not found');
    }

    // Generate the unique identifier for the "number" property
    const number = shortid.generate();

    // Create a Partial<Invoice> object with the retrieved Order
    const invoicePartial: Partial<Invoice> = {
      order: order,
      number: number,
    };

    // Save the converted Partial<Invoice> to the database
    const createdInvoice = await this.invoiceRepository.save(invoicePartial);

    return createdInvoice;
  }

  async findAll() {
    const invoices = await this.invoiceRepository.find();
    return invoices;
  }

  async findOne(id: number) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    return invoice;
  }

  async findOneByOrderId(orderId: string) {
    const invoice = await this.invoiceRepository.findOne({
      where: { order: { id: orderId } },
    });

    console.log('orderId', orderId);
    console.log('invoice', invoice);

    return invoice;
  }

  async remove(id: string) {
    const invoice = await this.findOneByOrderId(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    await this.invoiceRepository.remove(invoice);

    return { message: 'Invoice removed' };
  }

  async softDelete(id: string) {
    const invoice = await this.findOneByOrderId(id);
    if (!invoice) {
      throw new NotFoundException('Invoice not found or already deleted');
    }

    await this.invoiceRepository.softRemove(invoice);

    return { message: 'Invoice removed' };
  }
}
