import { Controller, Get } from '@nestjs/common';
import { CliService } from './cli.service';

@Controller()
export class CliController {
  constructor(private readonly cliService: CliService) {}

  @Get()
  public getHello(): string {
    return this.cliService.getHello();
  }
}
