import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCridentialsDto {
  // @IsString()
  @IsEmail()
  @MinLength(4)
  @MaxLength(20)
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  password: string
}