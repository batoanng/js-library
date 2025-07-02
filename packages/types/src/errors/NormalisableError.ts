import { AxiosError } from 'axios';
import { ApiError, ErrorWithMessage, PayloadError } from '.';

export type NormalisableError = Error | AxiosError | PayloadError | ApiError | ErrorWithMessage | unknown;
