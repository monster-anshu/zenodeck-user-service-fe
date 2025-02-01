import { AxiosError, AxiosResponse } from 'axios';
import { redirectWindow } from '~/utils/url';
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

export const commonErrorAuthInterceptor = async (error: AxiosError) => {
  const status = error.response?.status;
  const redirect = error.response?.headers['x-zenodeck-redirect'];
  const data = error.response?.data as ApiResponse;

  let message = 'Something went wrong';
  message = data?.error || error.message || message;

  if (redirect) {
    await redirectWindow(redirect);
    return;
  }

  if (status === 401) {
    await redirectWindow('/login');
    return;
  }

  throw new ApiError(message, data);
};
