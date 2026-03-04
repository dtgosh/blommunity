import { AccountService } from '@app/account';
import { Serialize } from '@app/util/decorators/serialize.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public, User } from '../auth/auth.decorators';
import type { AuthenticatedUser } from '../auth/auth.interfaces';
import { CreateAccountDto } from './dto/create-account.dto';
import { FindAllAccountsDto } from './dto/find-all-accounts.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountDetailEntity } from './entities/account-detail.entity';
import { FindAllAccountsEntity } from './entities/find-all-accounts.entity';

@ApiTags('계정')
@Serialize()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountService) {}

  /**
   * 계정 생성
   *
   * @remarks 새로운 계정을 생성합니다.
   */
  @Public()
  @Post()
  public async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountDetailEntity> {
    const result = await this.accountService.create(createAccountDto);

    return new AccountDetailEntity(result);
  }

  /**
   * 계정 목록 조회
   *
   * @remarks 계정 목록을 조회합니다. 인증 없이 접근 가능하며, 페이지네이션을 지원합니다.
   */
  @Public()
  @Get()
  public async findAll(
    @Query() findAllAccountsDto: FindAllAccountsDto,
  ): Promise<FindAllAccountsEntity> {
    const result = await this.accountService.findAll(findAllAccountsDto);

    return new FindAllAccountsEntity(result);
  }

  /**
   * 계정 상세 조회
   *
   * @remarks 계정의 상세 정보를 조회합니다. 인증 없이 접근 가능합니다.
   */
  @Public()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<AccountDetailEntity> {
    const result = await this.accountService.findOne(BigInt(id));

    return new AccountDetailEntity(result);
  }

  /**
   * 계정 수정
   *
   * @remarks 계정 정보를 수정합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<AccountDetailEntity> {
    const result = await this.accountService.update(
      BigInt(id),
      updateAccountDto,
    );

    return new AccountDetailEntity(result);
  }

  /**
   * 계정 삭제
   *
   * @remarks 계정을 삭제합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @Delete(':id')
  public async remove(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.accountService.remove(BigInt(id));
  }
}
