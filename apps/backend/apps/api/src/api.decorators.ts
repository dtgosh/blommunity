import {
  applyDecorators,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

export const Serialize = (
  strategy: 'excludeAll' | 'exposeAll' = 'excludeAll',
): MethodDecorator & ClassDecorator =>
  applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({ strategy }),
  );
