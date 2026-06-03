import { Admin, AdminOnly, Public, User } from './auth.decorators';
import type { AdminTokenPayload, UserTokenPayload } from './auth.interfaces';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminSignInDto } from './dto/admin-sign-in.dto';
import { AdminSignUpDto } from './dto/admin-sign-up.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { TenantSignUpDto } from './dto/tenant-sign-up.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   *
   * @remarks 새로운 계정을 생성합니다. 성공 시 JWT 토큰을 반환합니다.
   */
  @Public()
  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    return this.authService.userSignUp(signUpDto);
  }

  /**
   * 로그인
   *
   * @remarks 계정 정보로 로그인합니다. 성공 시 JWT 토큰을 반환합니다.
   *
   * @throws {401} Unauthorized
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto): Promise<string> {
    return this.authService.userSignIn(signInDto);
  }

  /**
   * 테넌트 회원가입
   *
   * @remarks 새로운 테넌트와 최초 사용자 계정을 함께 생성합니다. 성공 시 JWT 토큰을 반환합니다.
   */
  @Public()
  @Post('tenant-sign-up')
  public tenantSignUp(
    @Body() tenantSignUpDto: TenantSignUpDto,
  ): Promise<string> {
    return this.authService.tenantSignUp(tenantSignUpDto);
  }

  /**
   * 내 비밀번호 변경
   *
   * @remarks 현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
   *
   * @throws {401} Unauthorized
   */
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('change-password')
  public changePassword(
    @User() { id, tenantId }: UserTokenPayload,
    @Body() { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changeUserPassword({
      userId: id,
      tenantId,
      currentPassword,
      newPassword,
    });
  }

  /**
   * 관리자 회원가입
   *
   * @remarks 새로운 관리자 계정을 생성합니다. 생성된 계정은 승인 대기 상태이며, MANAGER 이상 권한자의 승인 후 로그인할 수 있습니다.
   */
  @Public()
  @Post('admin/sign-up')
  public adminSignUp(@Body() signUpDto: AdminSignUpDto): Promise<void> {
    return this.authService.adminSignUp(signUpDto);
  }

  /**
   * 관리자 로그인
   *
   * @remarks 관리자 계정 정보로 로그인합니다. 성공 시 JWT 토큰을 반환합니다.
   *
   * @throws {401} Unauthorized
   */
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('admin/sign-in')
  public adminSignIn(@Body() signInDto: AdminSignInDto): Promise<string> {
    return this.authService.adminSignIn(signInDto);
  }

  /**
   * 관리자 내 비밀번호 변경
   *
   * @remarks 현재 비밀번호 확인 후 새 비밀번호로 변경합니다.
   *
   * @throws {401} Unauthorized
   */
  @ApiBearerAuth()
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('admin/change-password')
  public adminChangePassword(
    @Admin() { id }: AdminTokenPayload,
    @Body() { currentPassword, newPassword }: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changeAdminPassword({
      adminId: id,
      currentPassword,
      newPassword,
    });
  }
}
