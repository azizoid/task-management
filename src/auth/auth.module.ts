import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'topSecret',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || 3600
      }
    }),
    TypeOrmModule.forFeature([UserRepository]),
    MailerModule.forRoot({
      transport: {
        sendmail: true,
        newline: 'unix',
        path: "/usr/sbin/sendmail"
      },
      defaults: {
        from: '"Teklif.az" <aziz@teklif.az>',
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.yandex.ru',
    //     port: 587,
    //     secure: false, // upgrade later with STARTTLS
    //     auth: {
    //       // user: "aziz.shahhuseynov@yandex.com",
    //       // pass: "k4cfh72g",
    //       user: "aziz@good.rs",
    //       pass: "DhJvvqHkBBVhA26",
    //     },
    //   },
    //   defaults: {
    //     from: '"Teklif.az" <aziz@good.rs>',
    //   },
    //   template: {
    //     dir: process.cwd() + '/templates/',
    //     adapter: new HandlebarsAdapter(), // or new PugAdapter()
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy
  ],
  exports: [
    JwtStrategy,
    PassportModule
  ]
})
export class AuthModule { }
