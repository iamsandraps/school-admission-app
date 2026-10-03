import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RegistrationController } from './registration.controller.js';
import { RegistrationService } from './registration.service.js';
import { Student, StudentSchema } from '../students/schemas/student.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
    ]),
  ],
  controllers: [RegistrationController],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
