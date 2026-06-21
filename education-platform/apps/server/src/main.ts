import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import { JwtAuthGuard } from '@/utils/JWT/JwtAuthGuard';
import { Reflector } from '@nestjs/core';  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
 app.enableCors({
    // origin: process.env.FRONTEND_URL,
    origin: true,
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
