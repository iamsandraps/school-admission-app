import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../enums/gender.enum.js';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  studentName?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  previousSchool?: string;

  @IsOptional()
  @IsString()
  applyingGrade?: string;
}
