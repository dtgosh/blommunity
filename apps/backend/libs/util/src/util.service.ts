import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  public sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
