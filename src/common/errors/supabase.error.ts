import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
const logger = new Logger('SupabaseError');
export function handleSupabaseError(action: string, error: any) {
  logger.error(`${action} failed`, error);
  const message = error?.message?.toLowerCase() || '';
  const code = error?.code;
  // Auth related
  if (message.includes('jwt') || message.includes('token')) {
    throw new UnauthorizedException(`${action}: authorization failed`);
  }
  if (message.includes('permission denied') || message.includes('rls')) {
    throw new ForbiddenException(`${action}: access denied`);
  }

  // Not found
  if (code === 'PGRST116' || message.includes('not found')) {
    throw new NotFoundException(`${action}: resource not found`);
  }

  // Unique constraint
  if (
    code === '23505' ||
    message.includes('duplicate') ||
    message.includes('unique')
  ) {
    throw new ConflictException(`${action}: duplicate entry`);
  }

  // Foreign key violation
  if (code === '23503') {
    throw new BadRequestException(
      `${action}: missing related record (foreign key constraint)`,
    );
  }

  // Data validation
  if (code === '22001' || message.includes('value too long')) {
    throw new BadRequestException(`${action}: value too long`);
  }
  if (code === '22P02' || message.includes('invalid input syntax')) {
    throw new BadRequestException(`${action}: invalid input format`);
  }

  // Timeout/network
  if (message.includes('timeout') || message.includes('network')) {
    throw new InternalServerErrorException(
      `${action}: network or timeout issue`,
    );
  }

  throw new InternalServerErrorException(
    `${action} failed: ${error?.message ?? 'Unknown error'}`,
  );
}
