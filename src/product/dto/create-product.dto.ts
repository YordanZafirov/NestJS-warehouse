import { IsEnum, IsNotEmpty } from 'class-validator';
import { ItemType, UnitType } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(UnitType)
  unitType: UnitType;

  @IsEnum(ItemType)
  type: ItemType;
}
