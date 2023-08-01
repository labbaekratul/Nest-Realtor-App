import { HttpException, UnauthorizedException } from '@nestjs/common';

export const errorHandler = (
  statusCode: number,
  exception = true,
  message = '',
) => {
  switch (statusCode) {
    case 401:
      if (exception)
        throw new UnauthorizedException({
          message: 'Invalid Authentication',
        });
      throw new UnauthorizedException({
        message: 'Unauthorized',
      });
    case 403:
      throw new HttpException({ message: 'Invalid credentials' }, statusCode);
    case 404:
      throw new HttpException({ message: 'Not found' }, statusCode);
    case 406:
      throw new HttpException({ message: 'Not Acceptable' }, statusCode);
    case 409:
      throw new HttpException({ message: 'user already used' }, statusCode);
    default:
      throw new HttpException({ message }, 500);
  }
};
