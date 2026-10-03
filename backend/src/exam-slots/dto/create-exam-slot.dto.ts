import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExamSlotDto {
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;
}
