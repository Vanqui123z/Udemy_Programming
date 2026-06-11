import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  full_name!: string;


  @MinLength(6)
  password!: string;


}