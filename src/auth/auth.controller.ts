import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SupabaseAuthGuard } from './guard/auth.guard';
import { User } from '~/common/decorators/user.decorator';
import type { User as SupabaseUser } from '@supabase/supabase-js';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Get('me')
  me(@User() user: SupabaseUser) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(SupabaseAuthGuard)
  @Get('tenant')
  async getAllTenant() {
    return await this.service.getAllTenants();
  }

  @ApiBearerAuth()
  @Get(':tenantId')
  @UseGuards(SupabaseAuthGuard)
  getByTenant(@Param('tenantId', ParseIntPipe) tenantId: number) {
    return this.service.getByTenant(tenantId);
  }
}
