// getNormalisedError.test.ts
import { AxiosError } from 'axios';
import { getNormalisedError } from '../getNormalisedError';

describe('getNormalisedError', () => {
  it('should return normalised error from AxiosError', () => {
    const error = new AxiosError('Axios error occurred', undefined, {
      headers: { 'x-correlation-id': 'abc123' },
    } as any);
    (error as any).response = { status: 500 };

    const result = getNormalisedError(error);
    expect(result).toEqual({
      message: 'Axios error occurred',
      status: 500,
      code: undefined,
      correlationId: 'abc123',
    });
  });

  it('should return normalised error from ValidationError', () => {
    const error = {
      payload: {
        correlationId: 'val-123',
        type: 'validation-error',
        title: 'Validation Failed',
        status: 400,
        detail: 'Some fields are invalid',
        errors: {
          field1: 'must not be empty',
          field2: ['must be a number', 'required'],
        },
      },
    };

    const result = getNormalisedError(error);
    expect(result).toEqual({
      heading: 'Validation Failed',
      message: 'Some fields are invalid',
      status: 400,
      correlationId: 'val-123',
      validationErrors: {
        field1: ['must not be empty'],
        field2: ['must be a number', 'required'],
      },
    });
  });

  it('should return normalised error from ApiError', () => {
    const error = {
      payload: {
        correlationId: 'api-456',
        type: 'api-error',
        title: 'Something went wrong',
        status: 500,
        detail: 'Unexpected failure',
      },
    };

    const result = getNormalisedError(error);
    expect(result).toEqual({
      heading: 'Something went wrong',
      message: 'Unexpected failure',
      status: 500,
      correlationId: 'api-456',
    });
  });

  it('should return normalised error from PayloadError', () => {
    const error = {
      message: 'Payload error message',
      status: 403,
      correlationId: 'pl-789',
      payload: {},
    };

    const result = getNormalisedError(error);
    expect(result).toEqual({
      message: 'Payload error message',
      status: 403,
      correlationId: 'pl-789',
    });
  });

  it('should fallback to default error structure', () => {
    const error = {
      message: 'Generic error occurred',
    };

    const result = getNormalisedError(error);
    expect(result).toEqual({
      message: 'Generic error occurred',
    });
  });

  it('should return null if no error provided', () => {
    const result = getNormalisedError(undefined, null);
    expect(result).toBeNull();
  });
});
