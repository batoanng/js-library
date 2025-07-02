export interface PayloadError {
  status?: number;
  message: string;
  correlationId?: string;
  payload: unknown;
}
