import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ExamSlot, ExamSlotDocument } from './schemas/exam-slot.schema.js';
import { Student, StudentDocument } from '../students/schemas/student.schema.js';
import { ApplicationStatus } from '../students/enums/application-status.enum.js';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto.js';

@Injectable()
export class ExamSlotsService {
  constructor(
    @InjectModel(ExamSlot.name)
    private readonly examSlotModel: Model<ExamSlotDocument>,
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async createSlot(createExamSlotDto: CreateExamSlotDto) {
    const newSlot = new this.examSlotModel({
      date: createExamSlotDto.date,
      time: createExamSlotDto.time,
      isBooked: false,
    });

    const savedSlot = await newSlot.save();

    return {
      message: 'Exam slot created successfully',
      slot: this.formatSlotResponse(savedSlot),
    };
  }

  async getAvailableSlots() {
    const slots = await this.examSlotModel
      .find({ isBooked: false })
      .exec();

    return {
      slots: slots.map((slot) => this.formatSlotResponse(slot)),
    };
  }

  async bookSlot(slotId: string, studentId: string, parentId: string) {
    if (!Types.ObjectId.isValid(slotId) || !Types.ObjectId.isValid(studentId)) {
      throw new NotFoundException('Exam slot or student not found');
    }

    const student = await this.studentModel.findById(studentId);

    if (!student || student.parentId.toString() !== parentId) {
      throw new NotFoundException('Student not found');
    }

    if (student.status !== ApplicationStatus.REGISTRATION_FEE_PAID) {
      if (student.status === ApplicationStatus.APPLICATION_CREATED) {
        throw new BadRequestException(
          'Registration fee must be paid before booking an entrance exam slot.',
        );
      }
      if (
        student.examSlotId ||
        student.status === ApplicationStatus.SLOT_BOOKED ||
        student.status === ApplicationStatus.EXAM_COMPLETED ||
        student.status === ApplicationStatus.ADMISSION_COMPLETED
      ) {
        throw new BadRequestException(
          'Student already has an entrance exam slot booked.',
        );
      }
      throw new BadRequestException(
        'Slot booking is allowed only when status is Registration Fee Paid.',
      );
    }

    if (student.examSlotId) {
      throw new BadRequestException(
        'Student already has an entrance exam slot booked.',
      );
    }

    const slot = await this.examSlotModel.findById(slotId);

    if (!slot) {
      throw new NotFoundException('Exam slot not found');
    }

    if (slot.isBooked) {
      throw new BadRequestException('This exam slot is already booked.');
    }

    slot.isBooked = true;
    slot.bookedByStudentId = student._id as any;
    const updatedSlot = await slot.save();

    student.examSlotId = slot._id as any;
    student.status = ApplicationStatus.SLOT_BOOKED;
    const updatedStudent = await student.save();


    return {
      message: 'Entrance exam slot booked successfully',
      student: {
        id: updatedStudent._id.toString(),
        studentName: updatedStudent.studentName,
        status: updatedStudent.status,
        examSlot: this.formatSlotResponse(updatedSlot),
      },
    };
  }

  private formatSlotResponse(slot: ExamSlotDocument) {
    return {
      id: slot._id.toString(),
      date: slot.date,
      time: slot.time,
      isBooked: slot.isBooked,
      bookedByStudentId: slot.bookedByStudentId
        ? slot.bookedByStudentId.toString()
        : null,
      createdAt: (slot as any).createdAt,
      updatedAt: (slot as any).updatedAt,
    };
  }
}
