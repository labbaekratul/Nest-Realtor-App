import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^(?:\d{2}([-.])\d{3}\1\d{3}\1\d{3}|\d{11})$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
