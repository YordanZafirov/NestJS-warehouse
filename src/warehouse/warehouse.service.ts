import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { Repository } from 'typeorm';

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

      const updateWarehouse = await this.warehouseRepository.update(
        warehouse.id,
        updateWarehouseDto,
      );

      return updateWarehouse;
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
      if (removedWarehouse) {
        return { message: 'Warehouse removed successfully' };
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to remove warehouse',
      );
    }
  }

  async softDelete(id: string) {
    try {
      const warehouse = await this.findOne(id);

      if (!warehouse) {
        throw new BadRequestException('Warehouse not found');
      }

      const removedWarehouse = await this.warehouseRepository.softDelete(
        warehouse.id,
      );
      if (removedWarehouse) {
        return { message: 'Warehouse removed successfully' };
      }
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Failed to remove warehouse',
      );
    }
  }
}
