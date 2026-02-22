import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsNumber()
  public groupId!: number;

  @IsNotEmpty()
  @IsNumber()
  public authorId!: number;

  @IsNotEmpty()
  @IsString()
  public title!: string;

  @IsOptional()
  @IsString()
  public content?: string;

  @IsOptional()
  @IsBoolean()
  public isPublished?: boolean;
}
