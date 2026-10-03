import { IsNotEmpty, IsString } from 'class-validator';

export class AssignCourseDto {
  @IsString()
  @IsNotEmpty()
  assignedCourse: string;
}
