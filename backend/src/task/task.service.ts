import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';  // Assuming task model is in task.model.ts
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const taskData: Partial<Task> = {
      title: createTaskDto.title,
      description: createTaskDto.description ?? null, // ถ้าไม่มี description ให้เป็น null
      status: createTaskDto.status ?? 'pending', // ใช้ค่า default
      userId, // user ID ของ task
    };
  
    return await this.taskModel.create(taskData as Task);
  }
  

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel.findAll({
      where: { userId },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findByPk(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    return task.update(updateTaskDto);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await task.destroy();
  }
}
