import { GroupService } from '@app/group';
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
import { CreateGroupDto } from './dto/create-group.dto';
import { FindAllGroupsDto } from './dto/find-all-groups.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { FindAllGroupsEntity } from './entities/find-all-groups.entity';
import { GroupDetailEntity } from './entities/group-detail.entity';

@ApiTags('그룹')
@Serialize()
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupService) {}

  /**
   * 그룹 생성
   *
   * @remarks 새로운 그룹을 생성합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @Post()
  public async create(
    @User() user: AuthenticatedUser,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<GroupDetailEntity> {
    const result = await this.groupService.create(createGroupDto);

    return new GroupDetailEntity(result);
  }

  /**
   * 그룹 목록 조회
   *
   * @remarks 그룹 목록을 조회합니다. 인증 없이 접근 가능하며, 페이지네이션을 지원합니다.
   */
  @Public()
  @Get()
  public async findAll(
    @Query() findAllGroupsDto: FindAllGroupsDto,
  ): Promise<FindAllGroupsEntity> {
    const result = await this.groupService.findAll(findAllGroupsDto);

    return new FindAllGroupsEntity(result);
  }

  /**
   * 그룹 상세 조회
   *
   * @remarks 그룹의 상세 정보를 조회합니다. 인증 없이 접근 가능합니다.
   */
  @Public()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<GroupDetailEntity> {
    const result = await this.groupService.findOne(BigInt(id));

    return new GroupDetailEntity(result);
  }

  /**
   * 그룹 수정
   *
   * @remarks 그룹 정보를 수정합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupDetailEntity> {
    const result = await this.groupService.update(BigInt(id), updateGroupDto);

    return new GroupDetailEntity(result);
  }

  /**
   * 그룹 삭제
   *
   * @remarks 그룹을 삭제합니다. JWT 토큰 인증이 필요하며, 관리자만 삭제할 수 있습니다.
   */
  @ApiBearerAuth()
  @Delete(':id')
  public async remove(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.groupService.remove({
      groupId: BigInt(id),
      accountRole: user.role,
    });
  }
}
