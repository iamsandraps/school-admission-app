import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { Role } from '../common/enums/role.enum.js';

import { AuthService } from './auth.service.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';

import { Roles } from './decorators/roles.decorator.js';
import { AuthenticatedUser } from './types/authenticated-user.type.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(
    @Body() dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(
    @Req() request: Request,
  ) {
    const user =
      request.user as AuthenticatedUser;

    return {
      user,
    };
  }

  @Get('parent-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PARENT)
  parentTest() {
    return {
      message: 'Parent access granted',
    };
  }

  @Get('admission-test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMISSION_TEAM)
  admissionTest() {
    return {
      message:
        'Admission team access granted',
    };
  }
}