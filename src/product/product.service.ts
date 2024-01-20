import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemType, Product, UnitType } from './entities/product.entity';
import { Repository } from 'typeorm';

const allowedTypeToUnitType = {
  [ItemType.solid]: [UnitType.KILOGRAM],
  [ItemType.liquid]: [UnitType.LITER],
};

const checkCreateProductDto = (dto: CreateProductDto | UpdateProductDto) => {
  if (!Object.values(ItemType).includes(dto.type)) {
    throw new BadRequestException('Invalid item type');
  }

  if (!Object.values(UnitType).includes(dto.unitType)) {
    throw new BadRequestException('Invalid unit type');
  }

  const allowedUnitTypes = allowedTypeToUnitType[dto.type];

  if (!allowedUnitTypes || !allowedUnitTypes.includes(dto.unitType)) {
    throw new BadRequestException(
      'Invalid unit type for the specified product type',
    );
  }
};

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    try {
      checkCreateProductDto(createProductDto);

      const newProduct = this.productRepository.create(createProductDto);

      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to save product');
    }
  }

  async findAll() {
    const products = await this.productRepository.find();

    return products;
  }

  async findOne(id: string) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      return product;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to find product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      checkCreateProductDto(updateProductDto);
      
      const updateProduct = this.productRepository.create(updateProductDto);

      return await this.productRepository.save(updateProduct);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to update product',
      );
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const removedProduct = await this.productRepository.remove(product);
      if (removedProduct) {
        return { message: 'Product removed' };
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to remove product',
      );
    }
  }

  async softDelete(id: string) {
    try {
      const user = await this.productRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const removedProduct = await this.productRepository.softDelete(user.id);
      if (removedProduct) {
        return { message: 'Product removed' };
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to remove product',
      );
    }
  }
}
