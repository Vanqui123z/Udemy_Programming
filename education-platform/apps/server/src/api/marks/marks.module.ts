import { Module } from '@nestjs/common';
import { MarksController } from './marks.controller';
import { MarksService } from './marks.service';
import { JwtStrategy } from '@/utils/JWT/JwtStrategy';

@Module({
  imports: [],
  controllers: [MarksController],
  providers: [MarksService,JwtStrategy],
})
export class MarksModule {}
