import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @Roles('OPERATOR')
  @Patch(':uuid')
  update(@Param('uuid', new ParseUUIDPipe()) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles('OWNER')
  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.userService.remove(id);
  }

  @Roles('OPERATOR')
  @Delete('soft-delete/:uuid')
  softDelete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return this.userService.softDelete(id);
  }
}
