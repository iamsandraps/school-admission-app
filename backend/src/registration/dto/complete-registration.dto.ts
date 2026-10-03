import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CompleteRegistrationDto {
  @IsBoolean()
  @IsNotEmpty()
  paymentSuccess: boolean;
}
