import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '@database/entities';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  private sign(user: Pick<User, 'id' | 'email' | 'name' | 'role'>) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.sign(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    const existing = await this.userRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      name,
      passwordHash,
      role: 'driver',
      isActive: true,
    });
    const saved = await this.userRepository.save(user);

    return {
      access_token: this.sign(saved),
      user: {
        id: saved.id,
        email: saved.email,
        name: saved.name,
        role: saved.role,
      },
    };
  }

  validateToken(payload: any) {
    return payload;
  }
}
