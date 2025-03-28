import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}
  async create(registerDto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.userModel.create({
      email: registerDto.email,
      password: hashedPassword,
    } as User);
    return newUser;
}
  async findByEmail(email: string): Promise<User | null> {
    // ค้นหาผู้ใช้ตาม email
    return this.userModel.findOne({ where: { email } });
  }
}
