import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Space, Visibility } from '@app/db';

@ApiSchema({
  description: '게시판이 속한 공간의 상세 정보',
})
export class SpaceEntity {
  /** 공간 ID */
  @Expose()
  public id!: string;

  /** 공간 이름 */
  @Expose()
  public name!: string;

  /** 공간 설명 */
  @Expose()
  public description!: string | null;

  /** 가시성 */
  @Expose()
  public visibility!: Visibility;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(data: Partial<Space>) {
    Object.assign(this, data);
  }
}
