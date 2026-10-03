import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type.js';

@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(
    @Req() req: Request,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.studentsService.createStudent(createStudentDto, user.userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.studentsService.getParentStudents(user.userId);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthenticatedUser;
    return this.studentsService.getStudentById(id, user.userId);
  }

  @Get(':id/status')
  getStatus(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as AuthenticatedUser;
    return this.studentsService.getStudentStatus(id, user.userId);
  }

  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.studentsService.updateStudent(
      id,
      user.userId,
      updateStudentDto,
    );
  }
}
