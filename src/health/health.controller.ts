import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'nestjs-prisma';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private health: HealthCheckService,
    private ormIndicator: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return await this.health.check([
      async () =>
        await this.ormIndicator.pingCheck('database', this.prisma, {
          timeout: 3000,
        }),
      async () =>
        await this.memory.checkHeap('memory_heap', 1000 * 1024 * 1024),
      async () => await this.memory.checkRSS('memory_RSS', 1000 * 1024 * 1024),
      async () =>
        await this.disk.checkStorage('disk_health', {
          thresholdPercent: 10,
          path: '/',
        }),
    ]);
  }
}
