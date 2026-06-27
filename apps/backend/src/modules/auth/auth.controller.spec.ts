import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from '@common/dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              access_token: 'jwt-token',
              user: {
                id: 'user-id',
                email: 'test@example.com',
                name: 'Test User',
                role: 'driver',
              },
            }),
            register: jest.fn().mockResolvedValue({
              access_token: 'jwt-token',
              user: {
                id: 'user-id',
                email: 'newuser@example.com',
                name: 'New User',
                role: 'driver',
              },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should login user and return JWT token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = await controller.login(loginDto);

      expect(result.access_token).toBe('jwt-token');
      expect(result.user.email).toBe('test@example.com');
      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('register', () => {
    it('should register new user and return JWT token', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        password: 'Password123!',
        name: 'New User',
      };

      const result = await controller.register(registerDto);

      expect(result.access_token).toBe('jwt-token');
      expect(result.user.email).toBe('newuser@example.com');
      expect(authService.register).toHaveBeenCalledWith(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockRequest = {
        user: {
          sub: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'driver',
        },
      };

      const result = controller.getProfile(mockRequest);

      expect(result.message).toBe('Perfil recuperado com sucesso');
      expect(result.user).toEqual(mockRequest.user);
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('refreshToken', () => {
    it('should refresh JWT token', async () => {
      const mockRequest = {
        user: {
          sub: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'driver',
        },
      };

      authService['jwtService'] = {
        sign: jest.fn().mockReturnValue('new-jwt-token'),
      };

      const result = await controller.refreshToken(mockRequest);

      expect(result.message).toBe('Token renovado com sucesso');
      expect(result.access_token).toBe('new-jwt-token');
      expect(result.timestamp).toBeInstanceOf(Date);
    });
  });
});
