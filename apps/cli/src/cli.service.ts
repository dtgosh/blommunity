import { Injectable } from '@nestjs/common';

@Injectable()
export class CliService {
  public getHello(): string {
    return 'Hello World!';
  }
}
