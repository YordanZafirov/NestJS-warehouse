import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';
import { ItemType } from 'src/product/entities/product.entity';

const checkCreateWarehouseDto = (
  dto: CreateWarehouseDto | UpdateWarehouseDto,
) => {
  if (!Object.values(ItemType).includes(dto.type)) {
    throw new BadRequestException('Invalid item type');
  }
};

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
  ) {}
  async create(createWarehouseDto: CreateWarehouseDto) {
    try {
      const existingWarehouse = await this.warehouseRepository.findOne({
        where: {
          name: createWarehouseDto.name,
          address: createWarehouseDto.address,
        },
      });

      if (existingWarehouse) {
        throw new BadRequestException('Warehouse already exists');
      }

      checkCreateWarehouseDto(createWarehouseDto);

      const newWarehouse = this.warehouseRepository.create(createWarehouseDto);

      return await this.warehouseRepository.save(newWarehouse);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to save warehouse',
      );
    }
  }

  async findAll() {
    const warehouses = await this.warehouseRepository.find();

    return warehouses;
  }

  async findOne(id: string) {
    try {
      const warehouse = await this.warehouseRepository.findOneBy({ id });
      if (!warehouse) {
        throw new BadRequestException('Warehouse not found');
      }

      return warehouse;
    } catch (error) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto) {
    try {
      const warehouse = await this.findOne(id);

      if (!warehouse) {
        throw new BadRequestException('Warehouse not found');
      }

      checkCreateWarehouseDto(updateWarehouseDto);

      const updateWarehouse =
        this.warehouseRepository.create(updateWarehouseDto);

      return await this.warehouseRepository.save(updateWarehouse);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to save warehouse',
      );
    }
  }

  async remove(id: string) {
    try {
      const warehouse = await this.findOne(id);

      if (!warehouse) {
        throw new BadRequestException('Warehouse not found');
      }

      const removedWarehouse = await this.warehouseRepository.remove(warehouse);
      if(removedWarehouse){
        return {message: 'Warehouse removed successfully'}
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to remove warehouse',
      );
    }
  }

  async softDelete(id: string) {
    try {
      const user = await this.warehouseRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const removedWarehouse = await this.warehouseRepository.softDelete(user.id);
      if(removedWarehouse){
        return {message: 'Warehouse removed successfully'}
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to remove warehouse',
      );
    }
  }
}
