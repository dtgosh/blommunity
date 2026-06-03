import { ApiSchema } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

@ApiSchema({
  description: '게시판 초대 요청 시 전달하는 정보',
})
export class InviteBoardUserDto {
  /** 초대할 사용자 ID */
  @IsUUID()
  public inviteeId!: string;
}
