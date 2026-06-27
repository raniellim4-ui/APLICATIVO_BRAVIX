import { Controller, Post, Body, UseGuards, Get, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; name: string },
  ) {
    if (!body.email || !body.password || !body.name) {
      throw new BadRequestException(
        'Email, password, and name are required',
      );
    }

    return this.authService.register(body.email, body.password, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return {
      message: 'Profile fetched successfully',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req: any) {
    const user = req.user;
    const newToken = await this.authService['jwtService'].sign({
      sub: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      access_token: newToken,
      user,
    };
  }
}
