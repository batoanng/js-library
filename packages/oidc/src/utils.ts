import { AxiosInstance } from 'axios';
import { ApiClient, UnauthorizedRequestHandler } from './types';

export const setBearerToken = (axiosClient: AxiosInstance, token?: string | string[] | null) => {
  (axiosClient as ApiClient).accessToken = token;
};

export const setUnauthorizedRequestHandler = (axiosClient: AxiosInstance, handler?: UnauthorizedRequestHandler) => {
  (axiosClient as ApiClient).onUnauthorizedRequest = handler;
};
