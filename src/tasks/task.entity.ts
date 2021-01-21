import { ObjectId } from "mongodb";
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "./tasks-status.enum";
// import { User } from "src/auth/user.entity";

@Entity()
export class Task extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string;

  @Column()
  status: TaskStatus

  @Column()
  checked: boolean

  @Column()
  userId: ObjectId
}