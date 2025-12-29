import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { handleSupabaseError } from '~/common/errors/supabase.error';
import { Database } from '~/common/types/supabase.types';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getAllTenants() {
    const { data, error } = await this.supabase
      .from('tenant_members')
      .select('*');
    if (error) handleSupabaseError('Fetch tenant members', error);

    return data;
  }

  async getByTenant(tenantId: number) {
    const { data, error } = await this.supabase
      .from('tenant_members')
      .select('*')
      .eq('tenant_id', tenantId);

    if (error) handleSupabaseError('Fetch tenant members', error);
    return data?.length ? data : [];
  }
}
