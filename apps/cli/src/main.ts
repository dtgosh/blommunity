import { CliModule } from './cli.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap(): Promise<void> {
  await CommandFactory.run(CliModule, ['warn', 'error']);
}
void bootstrap();
