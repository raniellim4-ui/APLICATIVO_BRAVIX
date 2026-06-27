import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'manager' | 'driver' | 'mechanic';
}

@Injectable()
export class AuthService {
  private users: Map<string, User> = new Map();

  constructor(private jwtService: JwtService) {
    this.initializeMockUsers();
  }

  private initializeMockUsers() {
    const mockUsers: User[] = [
      {
        id: uuidv4(),
        email: 'admin@vehicleinspection.com',
        name: 'Admin User',
        passwordHash: bcrypt.hashSync('Admin@123456', 10),
        role: 'admin',
      },
      {
        id: uuidv4(),
        email: 'manager@vehicleinspection.com',
        name: 'Fleet Manager',
        passwordHash: bcrypt.hashSync('Manager@123456', 10),
        role: 'manager',
      },
      {
        id: uuidv4(),
        email: 'driver@vehicleinspection.com',
        name: 'João Driver',
        passwordHash: bcrypt.hashSync('Driver@123456', 10),
        role: 'driver',
      },
    ];

    mockUsers.forEach((user) => {
      this.users.set(user.email, user);
    });
  }

  async login(email: string, password: string) {
    const user = this.users.get(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    if (this.users.has(email)) {
      throw new UnauthorizedException('Email already in use');
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: userId,
      email,
      name,
      passwordHash,
      role: 'driver',
    };

    this.users.set(email, newUser);

    const token = this.jwtService.sign({
      sub: userId,
      email,
      name,
      role: 'driver',
    });

    return {
      access_token: token,
      user: {
        id: userId,
        email,
        name,
        role: 'driver',
      },
    };
  }

  validateToken(payload: any) {
    return payload;
  }
}
