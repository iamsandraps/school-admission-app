import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Student, StudentDocument } from '../students/schemas/student.schema.js';
import { ApplicationStatus } from '../students/enums/application-status.enum.js';
import { UpdateExamScoreDto } from './dto/update-exam-score.dto.js';
import { AssignCourseDto } from './dto/assign-course.dto.js';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async getApplications(status?: ApplicationStatus) {
    const filter = status ? { status } : {};
    const students = await this.studentModel.find(filter).exec();

    return {
      applications: students.map((student) =>
        this.formatStudentResponse(student),
      ),
    };
  }

  async updateExamScore(
    studentId: string,
    updateExamScoreDto: UpdateExamScoreDto,
  ) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new NotFoundException('Student application not found');
    }

    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    if (student.status !== ApplicationStatus.SLOT_BOOKED) {
      throw new BadRequestException(
        'Exam score can only be recorded when status is Slot Booked.',
      );
    }

    student.examScore = updateExamScoreDto.examScore;
    student.status = ApplicationStatus.EXAM_COMPLETED;
    const updatedStudent = await student.save();

    return {
      message: 'Exam score updated successfully',
      student: this.formatStudentResponse(updatedStudent),
    };
  }

  async assignCourse(studentId: string, assignCourseDto: AssignCourseDto) {
    if (!Types.ObjectId.isValid(studentId)) {
      throw new NotFoundException('Student application not found');
    }

    const student = await this.studentModel.findById(studentId);
    if (!student) {
      throw new NotFoundException('Student application not found');
    }

    if (student.status !== ApplicationStatus.EXAM_COMPLETED) {
      throw new BadRequestException(
        'Course can only be assigned when status is Exam Completed.',
      );
    }

    student.assignedCourse = assignCourseDto.assignedCourse;
    student.status = ApplicationStatus.ADMISSION_COMPLETED;
    const updatedStudent = await student.save();

    return {
      message: 'Course assigned successfully',
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
      examScore: student.examScore ?? null,
      assignedCourse: student.assignedCourse ?? null,
      createdAt: (student as any).createdAt,
      updatedAt: (student as any).updatedAt,
    };
  }
}
