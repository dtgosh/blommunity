import { Public } from './auth/auth.decorators';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('기본')
@Controller()
export class ApiController {
  /**
   * 헬스체크
   *
   * @remarks API 서버가 정상적으로 작동하는지 확인합니다.
   */
  @Public()
  @Get('health')
  public healthCheck(): string {
    return 'OK';
  }
}
