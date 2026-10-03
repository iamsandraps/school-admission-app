import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';

import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { Role } from '../common/enums/role.enum.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // Seed default Admission Team user if none exists
    const defaultAdmissionEmail = 'admission@school.com';
    const existing = await this.usersService.findByEmail(defaultAdmissionEmail);
    if (!existing) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await this.usersService.create({
        name: 'Admission Team',
        email: defaultAdmissionEmail,
        password: hashedPassword,
        role: Role.ADMISSION_TEAM,
      });
      console.log('Default Admission Team user created: admission@school.com / password123');
    }
  }

  async register(registerDto: RegisterDto) {
    const existingUser =
      await this.usersService.findByEmail(
        registerDto.email,
      );

    if (existingUser) {
      throw new ConflictException(
        'Email already registered',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        registerDto.password,
        10,
      );

    const userRole = registerDto.role || Role.PARENT;

    const user =
      await this.usersService.create({
        name: registerDto.name,
        email: registerDto.email.toLowerCase(),
        password: hashedPassword,
        role: userRole,
      });

    return {
      message: 'Registration successful',

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user =
      await this.usersService.findByEmail(
        loginDto.email,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        loginDto.password,
        user.password,
      );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken =
      await this.jwtService.signAsync(
        payload,
      );

    return {
      message: 'Login successful',

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}