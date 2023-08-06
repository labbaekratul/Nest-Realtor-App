import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './modules/home/home.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserInterceptor } from './modules/user/interceptors/user.interceptor';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: UserInterceptor }],
})
export class AppModule {}
