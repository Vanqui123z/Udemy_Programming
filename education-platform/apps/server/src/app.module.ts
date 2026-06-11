import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket/socket.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { RedisModule } from './utils/Redis/redis.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway],
})
export class AppModule { }
