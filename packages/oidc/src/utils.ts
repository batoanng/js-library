import { AxiosInstance } from 'axios';
import { ApiClient, UnauthorizedRequestHandler } from './types';

export const setBearerToken = (axiosClient: AxiosInstance, token?: string | string[] | null) => {
  const apiClient = axiosClient as ApiClient;
  apiClient.accessToken = token;
};

export const setUnauthorizedRequestHandler = (axiosClient: AxiosInstance, handler?: UnauthorizedRequestHandler) => {
  const apiClient = axiosClient as ApiClient;
  apiClient.onUnauthorizedRequest = handler;
};
