import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

export function Serialize(): <TFunction extends typeof Function, Y>(
  target: TFunction | object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void {
  return applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({ strategy: 'excludeAll' }),
  );
}
