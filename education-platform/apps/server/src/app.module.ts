import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket/socket.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './api/auth/auth.module';
import { RedisModule } from './utils/Redis/redis.module';
import { JwtAuthGuard } from './utils/JWT/JwtAuthGuard';
import { ScheduleModule } from '@nestjs/schedule';
import { CleanupModule } from '@/utils/ScheduleDB/cleanup.module';
import { MembersModule } from '@/api/members/members.module';
import { TaskModule } from '@/api/tasks/task.module';
import { MarksModule } from '@/api/marks/marks.module';


@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    // // schedule cleanup module
    // ScheduleModule.forRoot(),
    // CleanupModule,
    
    AuthModule,
    MembersModule,
    TaskModule,
    MarksModule,
    
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway,
    {
    provide: 'APP_GUARD',
    useClass: JwtAuthGuard,
  }],
})
export class AppModule { }
