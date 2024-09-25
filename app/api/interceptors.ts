import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse } from './client';

export class ApiError extends Error {
  meta: Record<string, unknown>;
  constructor(message: string, meta: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.meta = meta;
  }
}

export const commonResponseInterceptor = (response: AxiosResponse) => {
  const data = response.data as ApiResponse;
  if (data?.isSuccess && !data?.error) return response;
  // eslint-disable-next-line no-console
  console.log('Error on response', response.config.url);
  let message = 'Something went wrong';
  message = data?.error || message;
  if (message === 'PLAN_LIMIT') {
    message = 'Your plan limit has been reached.';
  }
  throw new ApiError(message, data);
};

export const commonErrorAuthInterceptor = (error: AxiosError) => {
  const status = error.response?.status;
  const redirect = error.response?.headers['x-orufy-redirect'];
  if (redirect) {
    window.location.href = redirect;
    return;
  }

  if (status === 401) {
    window.location.href = '/login';
  }

  throw new Error(error.message);
};
