import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed'])
  @IsOptional()
  status?: 'pending' | 'in_progress' | 'completed';
}
