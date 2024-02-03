import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductType, Product, UnitType } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  private readonly allowedTypeToUnitType = {
    [ProductType.SOLID]: [UnitType.KILOGRAM],
    [ProductType.LIQUID]: [UnitType.LITER],
  };
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

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

  async findAll() {
    const products = await this.productRepository.find();

    return products;
  }

  async create(createProductDto: CreateProductDto) {
    try {
      this.checkProductDto(createProductDto);

      const newProduct = this.productRepository.create(createProductDto);

      return await this.productRepository.save(newProduct);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to save product');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      this.checkProductDto(updateProductDto);

      const updateProduct = await this.productRepository.update(
        product.id,
        updateProductDto,
      );

      if (updateProduct) {
        return { message: 'Product updated' };
      }
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
      const user = await this.findOne(id);

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

  private checkProductDto = (dto: CreateProductDto | UpdateProductDto) => {
    if (!Object.values(ProductType).includes(dto.type)) {
      throw new BadRequestException('Invalid item type');
    }

    if (!Object.values(UnitType).includes(dto.unitType)) {
      throw new BadRequestException('Invalid unit type');
    }

    const allowedUnitTypes = this.allowedTypeToUnitType[dto.type];

    if (!allowedUnitTypes || !allowedUnitTypes.includes(dto.unitType)) {
      throw new BadRequestException(
        'Invalid unit type for the specified product type',
      );
    }
  };
}
