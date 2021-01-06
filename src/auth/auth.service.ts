import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCridentialsDto } from './dto/auth-cridentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) { }

  async signUp(authCridentialsDto: AuthCridentialsDto): Promise<void> {
    return this.userRepository.signUp(authCridentialsDto)
  }

  async signIn(authCridentialsDto: AuthCridentialsDto): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(authCridentialsDto)

    if (!username) {
      throw new UnauthorizedException('Invalid cridentials')
    }

    const payload: JwtPayload = { username }
    const accessToken = await this.jwtService.sign(payload)

    return { accessToken };
  }
}
