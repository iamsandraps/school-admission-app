import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AdmissionService } from './admission.service.js';
import { UpdateExamScoreDto } from './dto/update-exam-score.dto.js';
import { AssignCourseDto } from './dto/assign-course.dto.js';
import { ApplicationStatus } from '../students/enums/application-status.enum.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';

@Controller('admission')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMISSION_TEAM)
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Get('applications')
  getApplications(@Query('status') status?: ApplicationStatus) {
    return this.admissionService.getApplications(status);
  }

  @Patch(':studentId/score')
  updateExamScore(
    @Param('studentId') studentId: string,
    @Body() dto: UpdateExamScoreDto,
  ) {
    return this.admissionService.updateExamScore(studentId, dto);
  }

  @Patch(':studentId/course')
  assignCourse(
    @Param('studentId') studentId: string,
    @Body() dto: AssignCourseDto,
  ) {
    return this.admissionService.assignCourse(studentId, dto);
  }
}
