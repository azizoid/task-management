import { EntityRepository, MongoRepository } from "typeorm";

import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

import { User } from "src/auth/user.entity";
import { Task } from "./task.entity"
import { TaskStatus } from "./tasks-status.enum";
import { ObjectId } from "mongodb";

@EntityRepository(Task)
export class TaskRepository extends MongoRepository<Task> {

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto

    const query = new Object()
    query['userId'] = new ObjectId(user._id)

    if (status) {
      query['status'] = status
    }

    if (search) {
      query['content'] = new RegExp(`${search}`)
    }

    const tasks = await this.find(query)
    return tasks
  }

  async CreateTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { content } = createTaskDto

    const task = new Task()
    task.content = content;
    task.status = TaskStatus.OPEN;
    task.checked = false;
    task.userId = new ObjectId(user._id)
    await task.save();

    return task
  }
}