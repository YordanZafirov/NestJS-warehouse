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
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles('OPERATOR')
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.productService.findOne(id);
  }


  @Roles('OPERATOR')
  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Roles('OWNER')
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.productService.remove(id);
  }

  @Roles('OPERATOR')
  @Delete('soft-delete/:uuid')
  softDelete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.productService.softDelete(id);
  }
}
