import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
    ) { }
    async testRedis() {
        await this.redis.set('test', 'hello', 'EX', 60);
        const value = await this.redis.get('test');
        console.log(value);
    }
    async set(key: string, value: string, ttlSeconds?: number) {
        if (ttlSeconds) {
            await this.redis.set(key, value, 'EX', ttlSeconds);
        } else {
            await this.redis.set(key, value);
        }
    }
    async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }
    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }
}
