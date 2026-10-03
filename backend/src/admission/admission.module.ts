import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdmissionController } from './admission.controller.js';
import { AdmissionService } from './admission.service.js';
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
  controllers: [AdmissionController],
  providers: [AdmissionService],
  exports: [AdmissionService],
})
export class AdmissionModule {}
