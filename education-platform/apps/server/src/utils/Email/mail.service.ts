import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtpEmail(email: string, otp: string) {
    console.log(`Sending OTP email to ${email} with OTP: ${otp}`);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP Code to Reset Password',
      html: `
        <div>
          <h2>Forgot Password OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="color:#4f46e5">${otp}</h1>
          <p>OTP will expire in 5 minutes</p>
        </div>
      `,
    });
  }
}