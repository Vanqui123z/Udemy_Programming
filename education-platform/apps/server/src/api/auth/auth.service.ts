import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../utils/Redis/redist.service';
import { MailService } from 'src/utils/Email/mail.service';
import { SocialLoginDto } from './DTO/LoginDTO';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private redisService: RedisService, private mailService: MailService) { }
  async login(LoginDTO: any): Promise<any> {
    const user = await this.prisma.users.findUnique({
      where: { email: LoginDTO.email },
    });
    if (!user) {
      throw new UnauthorizedException(
        'Email not found',
      );
    }
    const isMatch = await bcrypt.compare(LoginDTO.password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException(
        'Wrong password',
      );
    }
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      message: 'Login success',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      },
      access_token: accessToken,
    };
  }
  async register(RegisterDTO: any): Promise<any> {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: RegisterDTO.email },
    });
    if (existingUser) {
      return {
        message: 'Email already exists',
      };
    }
    const passwordHash = await bcrypt.hash(RegisterDTO.password, 10);
    const user = await this.prisma.users.create({
      data: {
        email: RegisterDTO.email,
        full_name: RegisterDTO.full_name,
        password_hash: passwordHash,
        role: 'student',
      },
    });
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    };
    const accessToken = await this.jwtService.signAsync(payload);
    return {
      message: 'Registration success',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      access_token: accessToken,
    };
  }
  async forgotPassword(email: string): Promise<any> {
    const OTP = Math.floor(10000 + Math.random() * 90000).toString();
    await Promise.all([
      this.redisService.set(`forgot_password:${email}`, OTP, 300),
      this.mailService.sendOtpEmail(email, OTP)
    ]);
    return {
      message: 'OTP sent to email, please check your inbox!',
    };
  }

  async resetPassword(email: string, otp: string, new_password: string): Promise<{ status: boolean; message?: string }> {
    console.log(`Received reset password request for email: ${email} with OTP: ${otp} and new password: ${new_password}`);
    const storedOTP = await this.redisService.get(`forgot_password:${email}`);
    if (!storedOTP || storedOTP !== otp) {
      return { status: false, message: 'Invalid or expired OTP' };
    }
    const passwordHashPromise = bcrypt.hash(new_password, 10);
    if (storedOTP === otp) {
      await Promise.all([
        this.redisService.del(`forgot_password:${email}`),
        this.prisma.users.update({
          where: { email },
          data: {
            password_hash: await passwordHashPromise,
          }
        })
      ]);
      return { status: true, message: 'Password reset successfully' };
    }
    return { status: false, message: 'Invalid or expired OTP' };
  }

  async socialLogin(dto: SocialLoginDto) {

    let user =
      await this.prisma.users.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      user = await this.prisma.users.create({
        data: {
          email: dto.email,
          full_name: dto.full_name,
          avatar_url: dto.avatar ,
          role: 'student',
          password_hash: '', 
          provider: dto.provider,
          providerId: dto.providerId,
        },
        
      });
    }
    console.log("User after social login:", user);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken:
        await this.jwtService.signAsync(payload),

      refreshToken:
        await this.jwtService.signAsync(payload, {
          expiresIn: '1d',
        }),

      user,
    };
  }
}

