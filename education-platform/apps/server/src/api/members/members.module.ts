import { JwtStrategy } from '@/utils/JWT/JwtStrategy';
import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
    imports: [],
    controllers: [MembersController],
    providers: [JwtStrategy,MembersService],
})
    export class MembersModule {}