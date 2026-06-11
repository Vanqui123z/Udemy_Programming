import { IsEmail, Matches,  MinLength } from 'class-validator';

export class ResetPasswordOTD {
    @IsEmail()
    email!: string;

  @Matches(/^[0-9]{6}$/, { message: "OTP phải có đúng 6 chữ số" })
    otp!: string;

    @MinLength(6)
    new_password!: string;
}