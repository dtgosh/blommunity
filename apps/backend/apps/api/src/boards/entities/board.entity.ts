import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Board, Visibility } from '@app/db';

@ApiSchema({
  description: '공간에 속한 게시판의 상세 정보',
})
export class BoardEntity {
  /** 게시판 ID */
  @Expose()
  public id!: string;

  /** 소속 공간 ID */
  @Expose()
  public spaceId!: string;

  /** 게시판 이름 */
  @Expose()
  public name!: string;

  /** 게시판 설명 */
  @Expose()
  public description!: string | null;

  /** 가시성 */
  @Expose()
  public visibility!: Visibility;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(data: Partial<Board>) {
    Object.assign(this, data);
  }
}
