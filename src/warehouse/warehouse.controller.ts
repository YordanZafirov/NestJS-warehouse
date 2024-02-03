import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Roles('OPERATOR')
  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.warehouseService.findOne(id);
  }

  @Roles('OPERATOR')
  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Roles('OWNER')
  @Delete(':uuid')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.warehouseService.remove(id);
  }

  @Roles('OPERATOR')
  @Delete('soft-delete/:uuid')
  softDelete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.warehouseService.softDelete(id);
  }
}
