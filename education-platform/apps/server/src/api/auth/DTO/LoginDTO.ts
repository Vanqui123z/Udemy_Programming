import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class LoginDTO {
    @IsEmail()
    email!: string;
    @MinLength(6)
    password!: string;
}
export class SocialLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  full_name!: string;

  @IsOptional()
  avatar?: string;

  @IsString()
  provider!: 'GOOGLE' | 'GITHUB';

  @IsString()
  providerId!: string;
}