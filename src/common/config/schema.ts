import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  BASE_URL: z.url('BASE_URL must be a valid URL'),

  PORT: z
    .string()
    .default('5000')
    .transform((val) => {
      const num = Number(val);
      if (Number.isNaN(num) || num <= 0) {
        throw new Error('PORT must be a valid number');
      }
      return num;
    }),
  DATABASE_URL: z.string(),
  // RTSP_SERVER_URL: z.url(),
});

export type ConfigSchema = z.infer<typeof configSchema>;
