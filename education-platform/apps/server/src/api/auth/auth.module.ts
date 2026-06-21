import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule } from '@nestjs/jwt'
import { MailModule } from '@/utils/Email/mail.module';
import { JwtStrategy } from '@/utils/JWT/JwtStrategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
     PassportModule.register({
      defaultStrategy: 'jwt', 
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'auth_secret_key',
      signOptions: {
        expiresIn: "1d",
      },
    }),
      MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule { }
