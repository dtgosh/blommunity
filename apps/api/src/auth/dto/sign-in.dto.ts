import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @IsNotEmpty()
  @MinLength(8)
  public password!: string;
}
