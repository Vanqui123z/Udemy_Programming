import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { LoginDTO } from './DTO/LoginDTO';
import { RegisterDTO } from './DTO/RegisterDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    @Post('login')
    async Login(@Body() LoginDTO: LoginDTO): Promise<any> {
      return  this.authService.login(LoginDTO);
    }
    @Post('register')
    async Register(@Body() RegisterDTO: RegisterDTO): Promise<any> {
      return  this.authService.register(RegisterDTO);
    }
    @Post('forgotPassword')
    async ForgotPassword(@Body("email") email: string): Promise<any> {
        return this.authService.forgotPassword(email);
    }
    @Post('resetPassword')
    async ResetPassword(@Body() resetPasswordDTO: any): Promise<any> {
        return this.authService.resetPassword(
            resetPasswordDTO.email,
            resetPasswordDTO.otp,
            resetPasswordDTO.new_password
        );
    }
    @Post('social-login')
    async SocialLogin(@Body() socialLoginDto: any): Promise<any> {
        return this.authService.socialLogin(socialLoginDto);
    }
  }