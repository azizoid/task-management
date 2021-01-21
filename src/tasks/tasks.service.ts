import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

import { CreateTaskDto } from "./dto/create-task.dto"
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { ObjectID, ObjectId } from 'mongodb';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const conditions = { _id: new ObjectID(id), userId: new ObjectId(user._id) }
    const task = await this.taskRepository.findOne({ where: conditions })

    if (!task) {
      throw new NotFoundException(`Task with id ${id} does not exist`)
    }

    return task
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.CreateTask(createTaskDto, user)
  }

  async deleteTask(id: string, user: User): Promise<string> {
    const result = await this.taskRepository.deleteOne(
      { _id: new ObjectId(id), userId: new ObjectId(user._id) }
    );

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return id
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await this.taskRepository.replaceOne(
      { _id: task._id },
      task
    )
    return task;
  }
}
