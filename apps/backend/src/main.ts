import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const logger = new Logger('Bootstrap');
  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Middleware
  app.use(morgan('combined'));
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));
  app.use(new RateLimitMiddleware().use.bind(new RateLimitMiddleware()));

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 400,
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('🚗 Vehicle Inspection API')
    .setDescription('Intelligent Vehicle Inspection Assistant - Enterprise API')
    .setVersion('1.0.0')
    .setContact(
      'Vehicle Inspection Team',
      'https://github.com/raniellim4-ui/APLICATIVO_BRAVIX',
      'support@vehicleinspection.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'JWT',
    )
    .addTag('Auth', 'Authentication & Authorization')
    .addTag('Vehicles', 'Vehicle Management')
    .addTag('Drivers', 'Driver Management')
    .addTag('Inspections', 'Inspection Workflows')
    .addTag('Maintenance', 'Maintenance Scheduling')
    .addTag('Analytics', 'Fleet Analytics & Reports')
    .addTag('Health', 'System Health Checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  await app.listen(PORT, () => {
    logger.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🚗  VEHICLE INSPECTION API - ENTERPRISE                     ║
║  ✅  Server running on http://localhost:${PORT}              ║
║  🔧  Environment: ${NODE_ENV.toUpperCase()}                 ║
║  📚  Docs: http://localhost:${PORT}/api/docs                 ║
║  🛡️  Security: CORS, RBAC, Rate Limiting, Error Handling   ║
║                                                               ║
║  Database: PostgreSQL ✅                                     ║
║  Authentication: JWT + RBAC ✅                               ║
║  Logging: Enterprise ✅                                       ║
║  Validation: DTO + Class Validator ✅                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error starting application:', err);
  process.exit(1);
});
