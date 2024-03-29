import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProductType } from 'src/product/entities/product.entity';

export class CreateWarehouseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  address: string;

  @IsEnum(ProductType)
  type: ProductType;
}
