import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductType, UnitType } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsEnum(ProductType)
  type: ProductType;
}
