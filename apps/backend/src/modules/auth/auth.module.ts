import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DataSource } from 'typeorm';
import { User } from '@database/entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'jwt_secret_key',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION || '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'USER_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
      inject: ['DATA_SOURCE'],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
