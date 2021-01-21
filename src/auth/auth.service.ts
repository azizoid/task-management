import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from "@nestjs/jwt"


import { UserRepository } from './user.repository';

import { AuthCridentialsDto } from './dto/auth-cridentials.dto';
import { TokenCridentialsDto } from './dto/token-cridentials.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from "./interfaces/auth.response.interface"

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  async signUp(authCridentialsDto: AuthCridentialsDto): Promise<AuthResponse> {

    const username = await this.userRepository.signUp(authCridentialsDto)

    const generateToken = await this.generateToken(username)

    return { ...generateToken, username };
  }

  async signIn(authCridentialsDto: AuthCridentialsDto): Promise<AuthResponse> {
    const username = await this.userRepository.validateUserPassword(authCridentialsDto)

    if (!username) {
      throw new UnauthorizedException('Invalid cridentials')
    }

    const generateToken = await this.generateToken(username)

    return { ...generateToken };
  }

  async generateToken(username: string): Promise<AuthResponse> {

    const payload: JwtPayload = { username }

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

    this.userRepository.saveRefreshToken(username, refreshToken)

    return { accessToken, refreshToken, username, expiresIn: 3600 }
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

    const returnedGenerateToken = await this.generateToken(user['username'])

    return { ...returnedGenerateToken };
  }
}
