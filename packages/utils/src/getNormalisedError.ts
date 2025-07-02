import { AxiosError } from 'axios';
import {
  NormalisableError,
  NormalisedError,
  ErrorWithMessage,
  ApiError,
  ValidationError,
  ValidationErrorPayload,
  PayloadError,
} from '@batoanng/types';

export const getNormalisedError = (...errors: (NormalisableError | unknown)[]): NormalisedError | null => {
  for (const error of errors) {
    if (!error) continue;

    if (error instanceof AxiosError) {
      const { config, status, message, code, response } = error;

      return {
        message,
        status: response?.status ?? status,
        code,
        correlationId: config?.headers['x-correlation-id'],
      };
    }

    if (isValidationError(error)) {
      const { payload } = error;

      return {
        heading: payload.title,
        message: payload.detail,
        status: payload.status,
        correlationId: payload.correlationId,
        validationErrors:
          payload.errors != null
            ? Object.fromEntries(
                Object.entries(payload.errors).map(([key, value]) => [key, Array.isArray(value) ? value : [value]])
              )
            : undefined,
      };
    }

    if (isApiError(error)) {
      const { payload } = error;

      return {
        heading: payload.title,
        message: payload.detail,
        status: payload.status,
        correlationId: payload.correlationId,
      };
    }

    if (isPayloadError(error)) {
      const { message, status, correlationId } = error;

      return {
        message,
        status,
        correlationId,
      };
    }

    return {
      message: (error as ErrorWithMessage)!.message ?? 'An unknown error has occurred.',
    };
  }

  return null;
};

function isApiError(error: unknown): error is ApiError {
  const payload = (error as ApiError).payload;

  return Boolean(payload && (payload.type || payload.status || payload.correlationId));
}

function isValidationError(error: unknown): error is ValidationError {
  if (!isApiError(error)) return false;

  const errorPayload = error.payload as ValidationErrorPayload;
  return errorPayload.status === 400 && errorPayload.errors != null;
}

function isPayloadError(error: unknown): error is PayloadError {
  const payloadError = error as PayloadError;

  return Boolean(payloadError.message || payloadError.status || payloadError.payload);
}
