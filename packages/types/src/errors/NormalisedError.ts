export interface NormalisedError {
  heading?: string;
  message: string;
  correlationId?: string;
  status?: number;
  code?: string;
  validationErrors?: Record<string, string[]>;
  disableMessage?: boolean;
}
