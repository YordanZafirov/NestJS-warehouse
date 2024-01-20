import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import validator from 'validator';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}
  async create(createClientDto: CreateClientDto) {
    try {
      // Check if the email is already in use
      const existingUser = await this.clientRepository.findOne({
        where: { email: createClientDto.email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already in use');
      }
      const newClient = this.clientRepository.create(createClientDto);

      return await this.clientRepository.save(newClient);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to save client');
    }
  }

  async findAll() {
    const clients = await this.clientRepository.find();

    return clients;
  }

  async findOne(id: string) {
    try {
      const client = await this.clientRepository.findOne({
        where: { id },
        relations: ['orders'],
      });

      if (!client || client.deletedAt) {
        throw new NotFoundException('Client not found');
      }

      return client;
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to find client');
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.clientRepository.findOneBy({ id });

      if (!client || client.deletedAt) {
        throw new NotFoundException('User not found');
      }

      const updateClient = this.clientRepository.create(updateClientDto);

      return await this.clientRepository.save(updateClient);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      const client = await this.findOne(id);

      if (!client || client.deletedAt) {
        throw new NotFoundException('User not found');
      }

      const removedClient = await this.clientRepository.remove(client);
      if (removedClient) {
        return { message: 'Client removed' };
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to remove client');
    }
  }

  async softDelete(id: string) {
    try {
      const client = await this.clientRepository.findOneBy({ id });

      if (!client || client.deletedAt) {
        throw new NotFoundException('User not found');
      }

      const removedClient = await this.clientRepository.softDelete(client.id);
      if (removedClient) {
        return { message: 'Client removed' };
      }
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to remove client');
    }
  }
}
