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
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Roles('OPERATOR')
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.clientService.findOne(id);
  }

  @Roles('OPERATOR')
  @Patch(':uuid')
  update(
    @Param('uuid', new ParseUUIDPipe()) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.update(id, updateClientDto);
  }

  @Roles('OWNER')
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.clientService.remove(id);
  }

  @Roles('OPERATOR')
  @Delete('soft-delete/:uuid')
  softDelete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.clientService.softDelete(id);
  }
}
