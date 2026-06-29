import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const jwt = { sign: jest.fn().mockReturnValue('token') };
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jwt.sign.mockReturnValue('token');
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwt },
        { provide: 'USER_REPOSITORY', useValue: mockRepo },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('login retorna token + user com credenciais válidas', async () => {
    const passwordHash = bcrypt.hashSync('Admin@123456', 10);
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      email: 'a@b.com',
      name: 'Admin',
      role: 'admin',
      passwordHash,
      isActive: true,
    });
    const res = await service.login('a@b.com', 'Admin@123456');
    expect(res.access_token).toBe('token');
    expect(res.user.email).toBe('a@b.com');
    expect(res.user.role).toBe('admin');
  });

  it('login lança Unauthorized com senha errada', async () => {
    const passwordHash = bcrypt.hashSync('correta', 10);
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      email: 'a',
      name: 'A',
      role: 'admin',
      passwordHash,
      isActive: true,
    });
    await expect(service.login('a', 'errada')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('login lança Unauthorized quando usuário não existe', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.login('x', 'y')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('login lança Unauthorized quando inativo', async () => {
    const passwordHash = bcrypt.hashSync('senha', 10);
    mockRepo.findOne.mockResolvedValue({
      id: '1',
      email: 'a',
      name: 'A',
      role: 'admin',
      passwordHash,
      isActive: false,
    });
    await expect(service.login('a', 'senha')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('register cria driver e retorna token', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    mockRepo.create.mockImplementation((u: any) => u);
    mockRepo.save.mockImplementation((u: any) =>
      Promise.resolve({ id: '2', ...u }),
    );
    const res = await service.register('new@b.com', 'Senha@123456', 'New');
    expect(res.user.role).toBe('driver');
    expect(res.user.email).toBe('new@b.com');
    expect(res.access_token).toBe('token');
  });

  it('register lança Conflict em email duplicado', async () => {
    mockRepo.findOne.mockResolvedValue({ id: '1', email: 'dup@b.com' });
    await expect(
      service.register('dup@b.com', 'x', 'Y'),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
