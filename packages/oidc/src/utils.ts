import { AxiosInstance } from 'axios';
import { ApiClient, UnauthorizedRequestHandler } from './types';

export const setBearerToken = (axiosClient: AxiosInstance, token?: string | string[] | null) => {
  const apiClient = axiosClient as ApiClient;
  apiClient.accessToken = token;

  const authorizationHeader = Array.isArray(token) ? token.join(' ') : token;

  if (authorizationHeader) {
    apiClient.defaults.headers.common.Authorization = authorizationHeader;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const setUnauthorizedRequestHandler = (axiosClient: AxiosInstance, handler?: UnauthorizedRequestHandler) => {
  const apiClient = axiosClient as ApiClient;
  apiClient.onUnauthorizedRequest = handler;
};
