import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    try {
      const user = await this.userService.findOne(email);

      if (user) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 14);

      const newUser = await this.userService.create({
        email,
        password: hashedPassword,
      });

      return { success: true, user: newUser };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to save user');
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userService.findOne(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { id: user.id, email: user.email, role: user.role };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to login');
    }
  }
}
