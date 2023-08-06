import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { User } from '../user/decorators/user.decorator';
import { UserInterceptInfo } from 'src/interface/mixin';
import { errorHandler } from 'src/helpers/errorHanders';
import { UserType } from '@prisma/client';
import { AuthGuard } from 'src/utils/auth.guard';
import { Roles } from '../user/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(): Promise<HomeResponseDto[]> {
    return this.homeService.getHomes();
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number): Promise<HomeResponseDto> {
    return this.homeService.getHome(id);
  }

  @Roles(UserType.REALTOR, UserType.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInterceptInfo) {
    return this.homeService.createHome(body, user.id);
  }

  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInterceptInfo,
  ): Promise<HomeResponseDto> {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) return errorHandler(401, false);
    return this.homeService.updateHome(id, body);
  }

  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInterceptInfo,
  ) {
    console.log(id);

    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) return errorHandler(401, false);
    return this.homeService.deleteHome(id);
  }
}
