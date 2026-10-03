import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { ApplicationStatus } from '../enums/application-status.enum.js';
import { Gender } from '../enums/gender.enum.js';
import { User } from '../../users/schemas/user.schema.js';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  parentId: MongooseSchema.Types.ObjectId | string;

  @Prop({
    required: true,
    trim: true,
  })
  studentName: string;

  @Prop({
    required: true,
  })
  dateOfBirth: string;

  @Prop({
    type: String,
    enum: Gender,
    required: true,
  })
  gender: Gender;

  @Prop({
    required: true,
    trim: true,
  })
  previousSchool: string;

  @Prop({
    required: true,
    trim: true,
  })
  applyingGrade: string;

  @Prop({
    type: String,
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLICATION_CREATED,
  })
  status: ApplicationStatus;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
