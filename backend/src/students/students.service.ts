import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Student, StudentDocument } from './schemas/student.schema.js';
import { ApplicationStatus } from './enums/application-status.enum.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private readonly studentModel: Model<StudentDocument>,
  ) {}

  async createStudent(
    createStudentDto: CreateStudentDto,
    parentId: string,
  ) {
    const newStudent = new this.studentModel({
      ...createStudentDto,
      parentId,
      status: ApplicationStatus.APPLICATION_CREATED,
    });

    const savedStudent = await newStudent.save();

    return {
      message: 'Student application created successfully',
      student: this.formatStudentResponse(savedStudent),
    };
  }

  async getParentStudents(parentId: string) {
    const students = await this.studentModel
      .find({ parentId })
      .exec();

    return {
      students: students.map((student) =>
        this.formatStudentResponse(student),
      ),
    };
  }

  async getStudentById(id: string, parentId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }

    const student = await this.studentModel.findOne({
      _id: id,
      parentId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      student: this.formatStudentResponse(student),
    };
  }

  async updateStudent(
    id: string,
    parentId: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }

    const student = await this.studentModel.findOne({
      _id: id,
      parentId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.status !== ApplicationStatus.APPLICATION_CREATED) {
      throw new BadRequestException(
        'Student details cannot be edited after registration fee payment.',
      );
    }

    Object.assign(student, updateStudentDto);
    const updatedStudent = await student.save();

    return {
      message: 'Student application updated successfully',
      student: this.formatStudentResponse(updatedStudent),
    };
  }

  async getStudentStatus(id: string, parentId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Student not found');
    }

    const student = await this.studentModel.findOne({
      _id: id,
      parentId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return {
      studentId: student._id.toString(),
      studentName: student.studentName,
      status: student.status,
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
      createdAt: (student as any).createdAt,
      updatedAt: (student as any).updatedAt,
    };
  }
}
