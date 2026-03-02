import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public, User } from './auth.decorators';
import type { AuthenticatedUser } from './auth.interfaces';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ProfileEntity } from './entities/profile.entity';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   *
   * @remarks 새로운 계정을 생성합니다. 인증 없이 접근 가능하며, 성공 시 JWT 토큰을 반환합니다.
   */
  @Public()
  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    return this.authService.signUp(signUpDto);
  }

  /**
   * 로그인
   *
   * @remarks 계정 정보로 로그인합니다. 인증 없이 접근 가능하며, 성공 시 JWT 토큰을 반환합니다.
   *
   * @throws {401} Unauthorized
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto): Promise<string> {
    return this.authService.signIn(signInDto);
  }

  /**
   * 내 프로필 조회
   *
   * @remarks 현재 로그인한 계정의 프로필을 조회합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ strategy: 'excludeAll' })
  @Get('profile')
  public getProfile(@User() user: AuthenticatedUser): ProfileEntity {
    return new ProfileEntity(user);
  }
}
