import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @IsNotEmpty()
  @MinLength(8)
  public password!: string;

  @IsOptional()
  @IsEmail()
  public email?: string;
}
