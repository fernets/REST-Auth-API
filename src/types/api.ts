import type { Response } from 'express';

type Status = 'success' | 'error';

type ApiResponsePayload<T> = {
  status: Status;
  data: T | null;
  message: string;
  code: number;
};

export type ApiResponse<T> = Response<ApiResponsePayload<T>>;
