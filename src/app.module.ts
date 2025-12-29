import { Module } from '@nestjs/common';

import { ConfigModule } from './common/config/config.module';
import { SupabaseModule as NestSupabaseModule } from 'nestjs-supabase-js';

import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from './common/config/schema';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    HealthModule,
    NestSupabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigSchema, true>) => ({
        supabaseUrl: config.get<string>('SUPABASE_URL'),
        supabaseKey: config.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
        // Use SERVICE_ROLE for backend, anon key only for frontend
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
