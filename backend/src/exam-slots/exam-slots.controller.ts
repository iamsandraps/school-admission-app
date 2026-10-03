import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { ExamSlotsService } from './exam-slots.service.js';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type.js';

@Controller('exam-slots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamSlotsController {
  constructor(private readonly examSlotsService: ExamSlotsService) {}

  @Post()
  @Roles(Role.ADMISSION_TEAM)
  createSlot(@Body() dto: CreateExamSlotDto) {
    return this.examSlotsService.createSlot(dto);
  }

  @Get()
  @Roles(Role.PARENT)
  getAvailableSlots() {
    return this.examSlotsService.getAvailableSlots();
  }

  @Post(':slotId/book/:studentId')
  @Roles(Role.PARENT)
  bookSlot(
    @Req() req: Request,
    @Param('slotId') slotId: string,
    @Param('studentId') studentId: string,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.examSlotsService.bookSlot(slotId, studentId, user.userId);
  }
}
