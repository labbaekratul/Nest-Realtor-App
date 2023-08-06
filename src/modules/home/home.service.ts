import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import {
  CreateHomeParams,
  UpdateHomeParams,
} from 'src/interface/home.interfaces';
import { errorHandler } from 'src/helpers/errorHanders';

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHomes(): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      include: {
        images: {
          select: { url: true },
        },
      },
    });
    return homes.map((home) => new HomeResponseDto(home));
  }

  async getHome(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      include: {
        images: {
          select: { url: true },
        },
      },
    });
    if (!home) return errorHandler(404);
    return new HomeResponseDto(home);
  }

  async createHome(
    data: CreateHomeParams,
    realtor_id: number,
  ): Promise<HomeResponseDto> {
    const newData = { ...data, realtor_id };
    const { images, ...inputs } = newData;
    const home = await this.prismaService.home.create({ data: inputs });
    const homeImages = images.map((image) => {
      return { ...image, home_id: home.id };
    });
    await this.prismaService.image.createMany({ data: homeImages });
    return new HomeResponseDto(home);
  }

  async updateHome(
    id: number,
    {
      address,
      number_of_bedrooms,
      number_of_bathrooms,
      city,
      price,
      land_size,
      propertyType,
    }: UpdateHomeParams,
  ): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.update({
      where: { id },
      data: {
        address,
        number_of_bedrooms,
        number_of_bathrooms,
        city,
        price,
        land_size,
        propertyType,
      },
    });
    return new HomeResponseDto(home);
  }

  async deleteHome(id: number) {
    return await this.prismaService.home.delete({ where: { id } });
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id,
      },
      select: {
        realtor: {
          select: {
            name: true,
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) return errorHandler(404);
    return home.realtor;
  }
}
