export type ApiErrorStatus = 400 | 401 | 403 | 404 | 422 | 500 | 524;

export interface ApiErrorPayload {
  correlationId: string;
  type: string;
  title: string;
  status: ApiErrorStatus;
  detail: string;
}

export interface ApiError {
  payload: ApiErrorPayload;
}
