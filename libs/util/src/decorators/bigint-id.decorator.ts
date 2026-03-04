import {
  applyDecorators,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { isNumberString } from 'class-validator';

/**
 * BigInt ID 필드를 위한 검증 및 변환 데코레이터입니다.
 *
 * - 요청(역직렬화): 숫자 문자열을 검증한 후 `string` → `BigInt`로 변환합니다
 * - 응답(직렬화): `BigInt` → `string`으로 변환합니다
 *
 * @example
 * ```typescript
 * class PostDto {
 *   @BigIntId()
 *   public id!: bigint;
 * }
 * ```
 */
export function BigIntId(): PropertyDecorator {
  return applyDecorators(
    ApiProperty({ type: String, example: '1' }),
    Transform(
      ({ key, value }) => {
        if (isNumberString(value, { no_symbols: true })) {
          return BigInt(value as string);
        }

        if (value === undefined || value === null) {
          return value as undefined | null;
        }

        throw new BadRequestException(`${key} must be a numeric value.`);
      },
      { toClassOnly: true },
    ),
    Transform(
      ({ key, value }) => {
        if (typeof value === 'bigint') {
          return value.toString();
        }

        if (value === undefined || value === null) {
          return value as undefined | null;
        }

        throw new InternalServerErrorException(`${key} is not bigint`);
      },
      { toPlainOnly: true },
    ),
  );
}
