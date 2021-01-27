import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from "@nestjs/jwt"


import { UserRepository } from './user.repository';

import { AuthCridentialsDto } from './dto/auth-cridentials.dto';
import { TokenCridentialsDto } from './dto/token-cridentials.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from "./interfaces/auth.response.interface"

import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: MailerService
  ) { }

  async signUp(authCridentialsDto: AuthCridentialsDto): Promise<string> {
    const { email, refreshToken } = await this.userRepository.signUp(authCridentialsDto)

    const sendingMail = await this.mailService.sendMail({
      from: "shaqhuseynov@gmail.com",
      to: email,
      subject: "Account activation",
      // text: `https://teklif.az/v1/auth/activate/${refreshToken}`,
      // html: `<p><a href="https://teklif.az/v1/auth/activate/${refreshToken}">Please follow the link to activate<a/></p>`,
      template: "signup",
      context: {  // Data to be sent to template engine.
        code: refreshToken,
        email: email,
      },
    }).then(() => `Sign Up was successful. Email sent to ${email} Please follow the link in your email to finish the registration`)

    return sendingMail;
  }

  async signIn(authCridentialsDto: AuthCridentialsDto): Promise<AuthResponse> {
    const email = await this.userRepository.validateUserPassword(authCridentialsDto)

    if (!email) {
      throw new UnauthorizedException('Invalid cridentials')
    }

    const generateToken = await this.generateToken(email)

    return { ...generateToken };
  }

  async activateUser(code: string): Promise<string> {
    return await this.userRepository.activateUser(code)
  }

  async generateToken(email: string): Promise<AuthResponse> {

    const payload: JwtPayload = { email }

    const accessToken = this.jwtService.sign(
      payload,
      {
        expiresIn: "1h",
        secret: process.env.ACCESS_TOKEN_SECRET,
      }
    )

    const refreshToken = this.jwtService.sign(
      payload,
      {
        expiresIn: "1d",
        secret: process.env.REFRESH_TOKEN_SECRET
      }
    )

    this.userRepository.saveRefreshToken(email, refreshToken)

    return { accessToken, refreshToken, email, expiresIn: 3600 }
  }

  async verifyToken(tokenCridentialsDto: TokenCridentialsDto): Promise<AuthResponse> {
    const { refreshToken } = tokenCridentialsDto;

    const refreshTokenVerified = await this.jwtService.verifyAsync(
      refreshToken,
      { secret: process.env.REFRESH_TOKEN_SECRET }
    ).catch(() => false)

    if (!refreshTokenVerified) {
      throw new UnauthorizedException('Invalid or Expired cridentials. Please login again')
    }

    const user = await this.userRepository.findOne({ refreshToken: refreshToken })

    if (!user) {
      throw new BadRequestException('Invalid or Expired cridentials. Please login again')
    }

    const returnedGenerateToken = await this.generateToken(user['email'])

    return { ...returnedGenerateToken };
  }
}
