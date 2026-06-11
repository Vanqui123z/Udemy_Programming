import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redist.service';
import 'dotenv/config';


@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(process.env.REDIS_URL!,{
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}