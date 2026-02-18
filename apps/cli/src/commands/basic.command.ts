import { Command, CommandRunner, Option } from 'nest-commander';

interface BasicCommandOptions {
  string?: string;
  boolean?: boolean;
  number?: number;
}

@Command({ name: 'basic', description: 'A parameter parse' })
export class BasicCommand extends CommandRunner {
  // eslint-disable-next-line @typescript-eslint/require-await
  public async run(
    passedParam: string[],
    options?: BasicCommandOptions,
  ): Promise<void> {
    if (options?.boolean !== undefined && options?.boolean !== null) {
      this.runWithBoolean(passedParam, options.boolean);
    } else if (options?.number) {
      this.runWithNumber(passedParam, options.number);
    } else if (options?.string) {
      this.runWithString(passedParam, options.string);
    } else {
      this.runWithNone(passedParam);
    }
  }

  @Option({
    flags: '-n, --number [number]',
    description: 'A basic number parser',
  })
  public parseNumber(val: string): number {
    return Number(val);
  }

  @Option({
    flags: '-s, --string [string]',
    description: 'A string return',
  })
  public parseString(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --boolean [boolean]',
    description: 'A boolean parser',
  })
  public parseBoolean(val: string): boolean {
    return JSON.parse(val) as boolean;
  }

  private runWithString(param: string[], option: string): void {
    console.log({ param, string: option });
  }

  private runWithNumber(param: string[], option: number): void {
    console.log({ param, number: option });
  }

  private runWithBoolean(param: string[], option: boolean): void {
    console.log({ param, boolean: option });
  }

  private runWithNone(param: string[]): void {
    console.log({ param });
  }
}
