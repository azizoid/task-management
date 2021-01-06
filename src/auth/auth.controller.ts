import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCridentialsDto } from './dto/auth-cridentials.dto';
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCridentialsDto: AuthCridentialsDto): Promise<void> {
    return this.authService.signUp(authCridentialsDto)
  }

  @Post("/signin")
  signIn(@Body(ValidationPipe) authCridentialsDto: AuthCridentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCridentialsDto)
  }
}
