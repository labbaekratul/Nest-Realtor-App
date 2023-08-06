import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SigninDto, SignupDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import { errorHandler } from 'src/helpers/errorHanders';
import * as bcrypt from 'bcryptjs';
import { User } from '../decorators/user.decorator';
import { UserInterceptInfo } from 'src/interface/mixin';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ): Promise<{ token: string }> {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) return errorHandler(401, false);
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidPassword = await bcrypt.compare(
        validProductKey,
        body.productKey,
      );
      if (!isValidPassword) return errorHandler(401, false);
    }

    return this.authService.signup(body, userType);
  }

  @Post('/signin')
  signin(@Body() body: SigninDto): Promise<{ token: string }> {
    return this.authService.signin(body);
  }

  @Post('/key')
  generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }

  @Get('/me')
  me(@User() user: UserInterceptInfo) {
    console.log(user);

    return user;
  }
}
