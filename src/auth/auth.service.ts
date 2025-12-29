import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/common/types/supabase.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly supabase: SupabaseClient<Database>) {}
  private handleSupabaseError(action: string, error: any) {
    this.logger.error(`${action} failed`, error);

    const message = error?.message?.toLowerCase() || '';
    const code = error?.code;

    // --- Auth / Token / Permission ----
    if (message.includes('jwt') || message.includes('token')) {
      throw new UnauthorizedException(`${action}: authorization failed`);
    }
    if (message.includes('permission denied') || message.includes('rls')) {
      throw new ForbiddenException(`${action}: access denied`);
    }

    // --- Not found / Empty response ---
    if (code === 'PGRST116' || message.includes('not found')) {
      throw new NotFoundException(`${action}: resource not found`);
    }

    // --- Unique constraint / conflict ---
    if (
      code === '23505' ||
      message.includes('duplicate') ||
      message.includes('unique')
    ) {
      throw new ConflictException(`${action}: duplicate entry`);
    }

    // --- Foreign key constraint ---
    if (code === '23503') {
      throw new BadRequestException(
        `${action}: related record missing (foreign key violation)`,
      );
    }

    // --- Data validation ---
    if (code === '22001' || message.includes('value too long')) {
      throw new BadRequestException(`${action}: value too long`);
    }
    if (code === '22P02' || message.includes('invalid input syntax')) {
      throw new BadRequestException(`${action}: invalid input format`);
    }

    // --- Timeout or network ---
    if (message.includes('timeout') || message.includes('network')) {
      throw new InternalServerErrorException(
        `${action}: network/timeout error`,
      );
    }

    // --- Default fallback ---
    throw new InternalServerErrorException(
      `${action} failed: ${error?.message ?? 'Unknown error'}`,
    );
  }
  async getAllTenants() {
    const { data, error } = await this.supabase
      .from('tenant_members')
      .select('*');
    if (error) this.handleSupabaseError('Fetch tenant_members', error);

    return data;
  }

  async getByTenant(tenantId: number) {
    const { data, error } = await this.supabase
      .from('tenant_members')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) this.handleSupabaseError('Fetch tenant members', error);
    return data?.length ? data : [];
  }
}
