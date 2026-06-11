import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule } from '@nestjs/jwt'
import { MailModule } from 'src/utils/Email/mail.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'auth_secret_key',
      signOptions: {
        expiresIn: "1d",
      },
    }),
      MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
