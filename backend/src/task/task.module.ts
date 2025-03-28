import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.model';
import { User } from '../user/user.model'; 

@Module({
  imports: [SequelizeModule.forFeature([Task, User])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
