import { EntityRepository, MongoRepository } from "typeorm";
import * as bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';

import { User } from "./user.entity";
import { AuthCridentialsDto } from "./dto/auth-cridentials.dto"
import { UnauthorizedException } from "@nestjs/common";
import { ObjectId } from "mongodb";

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {
  async signUp(authCridentials: AuthCridentialsDto): Promise<User> {
    const { email, password } = authCridentials
    const ifUserExists = await this.findOne({ email })

    if (ifUserExists) {
      throw new UnauthorizedException('Email exists')
    }

    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt);
    user.refreshToken = await uuidv4()
    user.status = false;

    await this.save(user);

    return user
  }

  async validateUserPassword(authCridentialsDto: AuthCridentialsDto): Promise<string> {
    const { email, password } = authCridentialsDto
    const user = await this.findOne({ email, status: true })

    if (user && await user.validatePassword(password)) {
      return user.email
    } else {
      return null
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  async saveRefreshToken(email, refreshToken: string): Promise<string> {
    const user = await this.findOne({ email })

    await this.update(
      { _id: new ObjectId(user["_id"]) },
      { refreshToken: refreshToken }
    )

    return refreshToken;
  }

  async activateUser(code: string): Promise<string> {
    const user = await this.findOne({ refreshToken: code, status: false })

    if (!user) {
      throw new UnauthorizedException('Wrong confirmation code')
    }

    await this.update(
      { _id: new ObjectId(user["_id"]) },
      { status: true }
    )

    return "Your account is now activated";
  }
}