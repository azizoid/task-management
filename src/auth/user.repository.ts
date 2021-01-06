import { EntityRepository, Repository } from "typeorm";
import * as bcrypt from "bcrypt"
import { User } from "./user.entity";
import { AuthCridentialsDto } from "./dto/auth-cridentials.dto"

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async signUp(authCridentials: AuthCridentialsDto): Promise<void> {
    const { username, password } = authCridentials

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt);

    await user.save();
  }

  async validateUserPassword(authCridentials: AuthCridentialsDto): Promise<string> {
    const { username, password } = authCridentials
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
}