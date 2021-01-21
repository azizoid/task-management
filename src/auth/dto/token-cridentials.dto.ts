import { IsString } from "class-validator";

export class TokenCridentialsDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string
}