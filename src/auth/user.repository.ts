import { EntityRepository, MongoRepository } from "typeorm";
import * as bcrypt from "bcrypt"

import { User } from "./user.entity";
import { AuthCridentialsDto } from "./dto/auth-cridentials.dto"
import { UnauthorizedException } from "@nestjs/common";
import { ObjectId } from "mongodb";

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  async signUp(authCridentials: AuthCridentialsDto): Promise<string> {
    const { username, password } = authCridentials
    const ifUserExists = await this.findOne({ username })

    if (ifUserExists) {
      throw new UnauthorizedException('Username exists')
    }

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt);
    user.refreshToken = ""

    await this.save(user);

    return user.username
  }

  async validateUserPassword(authCridentialsDto: AuthCridentialsDto): Promise<string> {
    const { username, password } = authCridentialsDto
    const user = await this.findOne({ username })

    if (user && await user.validatePassword(password)) {
      return user.username
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  async saveRefreshToken(username, refreshToken: string): Promise<string> {
    const user = await this.findOne({ username })

    await this.update(
      { _id: new ObjectId(user["_id"]) },
      { refreshToken: refreshToken }
    )

    return refreshToken;
  }
}