import { Injectable } from '@nestjs/common';
import { errorHandler } from 'src/helpers/errorHanders';
import { SigninParams, SignupParams } from 'src/interface/user.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import { generateToken } from 'src/utils/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  // ## USER SIGNUP

  async signup({
    name,
    email,
    phone,
    password,
  }: SignupParams): Promise<{ token: string }> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (userExists) return errorHandler(409);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER,
      },
    });

    const token = await generateToken({ name: user.name, id: user.id });
    return { token };
  }

  // ## USER SIGNIN

  async signin({ email, password }: SigninParams): Promise<{ token: string }> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) return errorHandler(403);
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) return errorHandler(403);
    const token = await generateToken({ name: user.name, id: user.id });
    return { token };
  }
}
