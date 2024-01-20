import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import validator from 'validator';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      if (!user) {
        throw new BadRequestException('User already exists');
      }

      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to save user');
    }
  }

  async findAll() {
    const users = await this.userRepository.find();

    const result = users.map(({ password, ...result }) => result);

    return result;
  }

  async findOne(identifier: string): Promise<User | undefined> {
    try {
      if (validator.isEmail(identifier)) {
        return await this.userRepository.findOne({
          where: { email: identifier },
        });
      } else {
        return await this.userRepository.findOne({ where: { id: identifier } });
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to find user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const updatedUser = this.userRepository.create(updateUserDto);

      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const userRemoved = await this.userRepository.remove(user);
      if(userRemoved) {
        return { message: 'User removed' }
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to remove user');
    }
  }

  async softDelete(id: string) {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const userRemoved = await this.userRepository.softDelete(user.id);
      if(userRemoved) {
        return { message: 'User removed' }
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to remove user');
    }
  }
}
