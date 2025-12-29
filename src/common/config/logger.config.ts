import { ConsoleLogger } from '@nestjs/common';

export class AppLogger extends ConsoleLogger {
  constructor(appTitle: string) {
    super({
      prefix: appTitle,
      timestamp: true,
      colors: true,
    });
  }
}
