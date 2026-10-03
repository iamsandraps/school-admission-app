import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Student } from '../../students/schemas/student.schema.js';

export type ExamSlotDocument = HydratedDocument<ExamSlot>;

@Schema({ timestamps: true, collection: 'ExamSlots' })
export class ExamSlot {
  @Prop({
    required: true,
    trim: true,
  })
  date: string;

  @Prop({
    required: true,
    trim: true,
  })
  time: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isBooked: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Student',
    required: false,
    default: null,
  })
  bookedByStudentId?: MongooseSchema.Types.ObjectId | string | null;
}

export const ExamSlotSchema = SchemaFactory.createForClass(ExamSlot);
