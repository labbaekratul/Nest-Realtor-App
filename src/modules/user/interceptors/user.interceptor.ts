import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { decodeToken } from 'src/utils/jwt.strategy';

export class UserInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    const user = await decodeToken(token);
    request.user = user;
    return handler.handle();
  }
}
