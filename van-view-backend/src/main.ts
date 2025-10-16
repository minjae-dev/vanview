import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { AppModule } from './app.module';
async function bootstrap() {
  try {
    console.log('🚀 Starting VanView Backend...');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Port: ${process.env.PORT || 3001}`);

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    const config = new DocumentBuilder()
      .setTitle('VanView API')
      .setDescription('Vancouver Business Directory API')
      .setVersion('1.0')
      .addTag('businesses')
      .addTag('reviews')
      .addTag('users')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        requestInterceptor: (req) => {
          req.credentials = 'include';
          return req;
        },
      },
    });
    app.use(express.json());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
      }),
    );

    app.enableCors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    app.use(cookieParser());

    const port = process.env.PORT || 3000;

    try {
      await app.listen(port, '0.0.0.0');
      console.log(`🚀 Application is running on port: ${port}`);
      console.log(`📖 Swagger documentation: /api`);
      console.log(`💚 Health check: /health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    } catch (error) {
      console.error('❌ Failed to start application:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error);
  process.exit(1);
});
