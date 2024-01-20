import { ArrayMinSize, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TransferType } from '../entities/order.entity';
import { CreateOrderDetailDto } from 'src/order-details/dto/create-order-detail.dto';

export class CreateOrderDto {
  @IsEnum(TransferType)
  type: TransferType;

  @IsUUID()
  clientId: string;

  @IsUUID()
  warehouseId: string;

  @IsOptional()
  @IsUUID()
  outgoingWarehouse?: string;

  @ArrayMinSize(1, { message: 'Must have at least one product'})
  product: CreateOrderDetailDto[];
}
