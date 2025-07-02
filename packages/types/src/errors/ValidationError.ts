import { ApiErrorPayload } from '.';

export interface ValidationErrorPayload extends ApiErrorPayload {
  errors: Record<string, string | string[]>;
}

export interface ValidationError {
  payload: ValidationErrorPayload;
}
