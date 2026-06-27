import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  // Configuration
  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Middleware
  app.use(morgan('combined'));

  // Global Pipes (Validation)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger Documentation (only in development)
  if (NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Vehicle Inspection API')
      .setDescription('Intelligent Vehicle Inspection Assistant API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Vehicles', 'Vehicle management')
      .addTag('Inspections', 'Inspection operations')
      .addTag('Drivers', 'Driver management')
      .addTag('Maintenance', 'Maintenance scheduling')
      .addTag('Analytics', 'Fleet analytics')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚗 Vehicle Inspection API                                   ║
║   ✅ Server running on port ${PORT}                         ║
║   🔧 Environment: ${NODE_ENV}                                ║
║   📚 Docs: http://localhost:${PORT}/api/docs                ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
  });
}

bootstrap();
