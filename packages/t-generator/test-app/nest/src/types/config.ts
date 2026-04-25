import { z } from 'zod';

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function toOptionalTrimmedString(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

function toBooleanFlag(value: unknown): unknown {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();

    if (normalized === '1' || normalized === 'true') {
      return true;
    }

    if (normalized === '0' || normalized === 'false') {
      return false;
    }
  }

  return value;
}

function toOriginList(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const origins = value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : undefined;
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

const stringSchema = z.preprocess(trimString, z.string().min(1));
const optionalStringSchema = z.preprocess(
  toOptionalTrimmedString,
  z.string().min(1).optional(),
);
const urlStringSchema = z.preprocess(trimString, z.string().url());
const booleanFlagSchema = z.preprocess(toBooleanFlag, z.boolean());
const corsOriginSchema = z.preprocess(
  toOriginList,
  z.array(z.string().min(1)).optional(),
);
const oidcAuthoritySchema = urlStringSchema.transform(stripTrailingSlash);

export const configSchema = z.object({
  API_PORT: z.coerce.number().int().positive(),
  API_VERSION: z.coerce.number().int().positive(),
  SWAGGER_ENABLE: booleanFlagSchema,
  DATABASE_URL: z.string().min(1),
  HEALTH_TOKEN: z.string().min(1),
  OIDC_AUTHORITY: oidcAuthoritySchema,
  OIDC_AUDIENCE: z.string().min(1),
  CORS_ORIGIN: corsOriginSchema,
});

export type Config = z.infer<typeof configSchema>;

let cachedConfig: Config | undefined;

function formatConfigError(error: z.ZodError): string {
  const fieldErrors = error.flatten().fieldErrors;
  return `Configuration not valid:\n${JSON.stringify(fieldErrors, null, 2)}`;
}

export function getConfig(): Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    throw new Error(formatConfigError(result.error));
  }

  cachedConfig = Object.freeze(result.data);

  return cachedConfig;
}

export const config = getConfig();
