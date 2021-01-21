import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';

import { Task } from "./task.entity"
import { TaskStatus } from './tasks-status.enum';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

import { CreateTaskDto } from "./dto/create-task.dto"
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ObjectidValidationPipe } from './pipes/objectid-validation.pipe';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user)
  }

  @Get("/:id")
  getTaskById(
    @Param('id', ObjectidValidationPipe) id: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ObjectidValidationPipe) id: string,
    @GetUser() user: User
  ): Promise<string> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ObjectidValidationPipe) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
