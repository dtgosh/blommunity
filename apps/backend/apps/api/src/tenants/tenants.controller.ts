import { AdminOnly } from '../auth/auth.decorators';
import { TenantService } from '@app/tenant';
import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantEntity } from './entities/tenant.entity';

@ApiTags('테넌트')
@ApiBearerAuth()
@AdminOnly()
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * 테넌트 목록 조회
   *
   * @remarks 전체 테넌트 목록을 조회합니다.
   */
  @Get()
  public async findAll(): Promise<TenantEntity[]> {
    const tenants = await this.tenantService.findAll({ deletedAt: null });

    return tenants.map((tenant) => new TenantEntity(tenant));
  }

  /**
   * 테넌트 상세 조회
   *
   * @remarks ID로 단일 테넌트를 조회합니다.
   */
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<TenantEntity> {
    const tenant = await this.tenantService.findOne({ id, deletedAt: null });

    return new TenantEntity(tenant);
  }

  /**
   * 테넌트 수정
   *
   * @remarks 테넌트 정보를 수정합니다.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantEntity> {
    const tenant = await this.tenantService.update({
      where: { id, deletedAt: null },
      data: updateTenantDto,
    });

    return new TenantEntity(tenant);
  }

  /**
   * 테넌트 삭제
   *
   * @remarks 테넌트를 삭제합니다(소프트 삭제).
   */
  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.tenantService.remove({ id, deletedAt: null });
  }
}
