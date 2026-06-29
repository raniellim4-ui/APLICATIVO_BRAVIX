import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { UPLOAD_DIR } from './modules/uploads/uploads.controller';
import { join } from 'path';
import express from 'express';
import morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const logger = new Logger('Bootstrap');
  const PORT = process.env.PORT || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Servir arquivos enviados em /uploads (fora do prefixo /api)
  app.use('/uploads', express.static(join(process.cwd(), UPLOAD_DIR)));

  // Prefixo global da API (frontends consomem http://host/api/...)
  app.setGlobalPrefix('api');

  // Filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  // Middlewares
  app.use(morgan('combined'));
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));
  app.use(new RateLimitMiddleware().use.bind(new RateLimitMiddleware()));

  // Pipe global de validação
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

  // Cabeçalhos de segurança
  app.use((req: any, res: any, next: any) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // Documentação Swagger
  const config = new DocumentBuilder()
    .setTitle('🚗 API de Inspeção Veicular')
    .setDescription('Assistente inteligente de inspeção veicular - API empresarial')
    .setVersion('1.0.0')
    .setContact(
      'Equipe de Inspeção Veicular',
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
    .addTag('Autenticação', 'Autenticação e autorização')
    .addTag('Veículos', 'Gestão de veículos')
    .addTag('Motoristas', 'Gestão de motoristas')
    .addTag('Inspeções', 'Fluxos de inspeção')
    .addTag('Manutenção', 'Agendamento de manutenção')
    .addTag('Análises', 'Análises e relatórios da frota')
    .addTag('Saúde', 'Verificações de saúde do sistema')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Iniciar servidor
  await app.listen(PORT, () => {
    logger.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🚗  API DE INSPEÇÃO VEICULAR - EMPRESARIAL                  ║
║  ✅  Servidor em execução: http://localhost:${PORT}          ║
║  🔧  Ambiente: ${NODE_ENV.toUpperCase()}                    ║
║  📚  Documentação: http://localhost:${PORT}/api/docs         ║
║  🛡️  Segurança: CORS, RBAC, limite de taxa e erros          ║
║                                                               ║
║  Banco de dados: PostgreSQL ✅                               ║
║  Autenticação: JWT + RBAC ✅                                  ║
║  Logs: empresarial ✅                                         ║
║  Validação: DTO + Class Validator ✅                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
    `);
  });
}

bootstrap().catch((err) => {
  console.error('Erro fatal ao iniciar a aplicação:', err);
  process.exit(1);
});
