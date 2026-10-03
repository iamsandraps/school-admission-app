import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from '../enums/gender.enum.js';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  previousSchool: string;

  @IsString()
  @IsNotEmpty()
  applyingGrade: string;
}
