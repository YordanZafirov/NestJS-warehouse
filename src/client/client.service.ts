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

  async findAll() {
    try {
      const clients = await this.clientRepository.find();
      return clients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error; // Rethrow the error or handle it as appropriate for your application.
    }
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

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const client = await this.clientRepository.findOneBy({ id });

      if (!client || client.deletedAt) {
        throw new NotFoundException('User not found');
      }

      const updateClient = await this.clientRepository.update(
        client.id,
        updateClientDto,
      );

      if (updateClient) {
        return { message: 'Client updated' };
      }
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
