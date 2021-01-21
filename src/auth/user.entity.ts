import { Column, Entity, Index, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from "bcrypt"
import { ObjectId } from "mongodb";
// import { Task } from "src/tasks/task.entity";

@Entity()
export class User {

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }

  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  password: string

  @Column()
  salt: string

  @Column()
  refreshToken: string

  // @OneToMany(type => Task, task => task.user, { eager: true })
  // tasks: Task[]

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password
  }
}