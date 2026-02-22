import { IsNumber, IsOptional } from 'class-validator';

export class FindAllPostsDto {
  @IsOptional()
  @IsNumber()
  public authorId?: number;

  @IsOptional()
  @IsNumber()
  public groupId?: number;

  @IsOptional()
  @IsNumber()
  public id?: number;

  @IsOptional()
  @IsNumber()
  public skip?: number;

  @IsOptional()
  @IsNumber()
  public take?: number;
}
