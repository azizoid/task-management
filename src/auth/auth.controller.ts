import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCridentialsDto } from './dto/auth-cridentials.dto';
import { TokenCridentialsDto } from './dto/token-cridentials.dto';
import { AuthResponse } from "./interfaces/auth.response.interface"
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCridentialsDto: AuthCridentialsDto): Promise<AuthResponse> {
    return this.authService.signUp(authCridentialsDto)
  }

  @Post("/signin")
  signIn(@Body(ValidationPipe) authCridentialsDto: AuthCridentialsDto): Promise<AuthResponse> {
    return this.authService.signIn(authCridentialsDto)
  }

  @Post("/refreshtoken")
  verifyToken(@Body(ValidationPipe) tokenCridentialsDto: TokenCridentialsDto): Promise<AuthResponse> {
    return this.authService.verifyToken(tokenCridentialsDto);
  }
}
