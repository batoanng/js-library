import { z } from 'zod';

const fallbackAppName = "next";

export const envSchema = z.object({
  appName: z.string().trim().min(1),
});

export type Env = z.infer<typeof envSchema>;

export const env = Object.freeze(
  envSchema.parse({
    appName: process.env.NEXT_PUBLIC_APP_NAME?.trim() || fallbackAppName,
  }),
);
