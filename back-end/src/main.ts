import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PATCH,DELETE'
  })
  
  await app.listen(3000);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
