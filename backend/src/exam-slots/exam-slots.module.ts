import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExamSlotsController } from './exam-slots.controller.js';
import { ExamSlotsService } from './exam-slots.service.js';
import { ExamSlot, ExamSlotSchema } from './schemas/exam-slot.schema.js';
import { Student, StudentSchema } from '../students/schemas/student.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ExamSlot.name,
        schema: ExamSlotSchema,
      },
      {
        name: Student.name,
        schema: StudentSchema,
      },
    ]),
  ],
  controllers: [ExamSlotsController],
  providers: [ExamSlotsService],
  exports: [ExamSlotsService],
})
export class ExamSlotsModule {}
