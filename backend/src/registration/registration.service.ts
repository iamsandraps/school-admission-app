import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Student, StudentDocument } from '../students/schemas/student.schema.js';
import { ApplicationStatus } from '../students/enums/application-status.enum.js';
import { CompleteRegistrationDto } from './dto/complete-registration.dto.js';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async completeRegistrationFee(
    studentId: string,
    parentId: string,
    dto: CompleteRegistrationDto,
  ) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new NotFoundException('Student not found');
    }

    const student = await this.studentModel.findById(studentId);

    if (!student || student.parentId.toString() !== parentId) {
      throw new NotFoundException('Student not found');
    }

    if (student.status !== ApplicationStatus.APPLICATION_CREATED) {
      if (student.registrationFeePaid) {
        throw new BadRequestException(
          'Registration fee has already been paid for this student.',
        );
      }
      throw new BadRequestException(
        'Registration fee payment can only be made when application status is Application Created.',
      );
    }

    if (!dto.paymentSuccess) {
      return {
        message: 'Registration payment failed',
        student: this.formatStudentResponse(student),
      };
    }

    student.registrationFeePaid = true;
    student.registrationFeePaidAt = new Date();
    student.status = ApplicationStatus.REGISTRATION_FEE_PAID;

    const updatedStudent = await student.save();

    return {
      message: 'Registration fee paid successfully',
      student: this.formatStudentResponse(updatedStudent),
    };
  }

  private formatStudentResponse(student: StudentDocument) {
    return {
      id: student._id.toString(),
      parentId: student.parentId.toString(),
      studentName: student.studentName,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      previousSchool: student.previousSchool,
      applyingGrade: student.applyingGrade,
      status: student.status,
      registrationFeePaid: student.registrationFeePaid ?? false,
      registrationFeePaidAt: student.registrationFeePaidAt ?? null,
      createdAt: (student as any).createdAt,
      updatedAt: (student as any).updatedAt,
    };
  }
}
