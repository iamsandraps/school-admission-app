import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateExamScoreDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  examScore: number;
}
