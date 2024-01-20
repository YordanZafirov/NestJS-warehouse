import { IsDecimal, IsOptional, IsUUID } from 'class-validator';

export class CreateOrderDetailDto {
  @IsDecimal()
  quantity: number;

  @IsDecimal()
  unitPrice: number;

  @IsUUID()
  productId: string;

  @IsUUID()
  orderId: string;
}
