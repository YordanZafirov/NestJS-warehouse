import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: 'http://localhost:5173' }); // for origin add the frontend url
  await app.listen(3000);
}
bootstrap();
