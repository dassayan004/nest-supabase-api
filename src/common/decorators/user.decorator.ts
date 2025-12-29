// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { User as SupabaseUser } from '@supabase/supabase-js';

export const User = createParamDecorator(
  (key: keyof SupabaseUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as SupabaseUser;

    return key ? user[key] : user;
  },
);
