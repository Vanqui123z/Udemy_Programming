import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtStrategy } from '@/utils/JWT/JwtStrategy';
import { TaskController } from './task.controller';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [TaskService,JwtStrategy],
})
export class TaskModule {}
