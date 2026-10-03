import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { RegistrationService } from './registration.service.js';
import { CompleteRegistrationDto } from './dto/complete-registration.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type.js';

@Controller('registration')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
export class RegistrationController {
  constructor(
    private readonly registrationService: RegistrationService,
  ) {}

  @Post(':studentId/pay')
  pay(
    @Req() req: Request,
    @Param('studentId') studentId: string,
    @Body() dto: CompleteRegistrationDto,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.registrationService.completeRegistrationFee(
      studentId,
      user.userId,
      dto,
    );
  }
}
