// auth.guard.ts
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SupabaseAuthGuard extends PassportAuthGuard('supabase') {}
