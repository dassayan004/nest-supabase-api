import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './strategy/supabase.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from 'nestjs-supabase-js';

@Module({
  imports: [PassportModule, SupabaseModule.injectClient()],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy],
})
export class AuthModule {}
