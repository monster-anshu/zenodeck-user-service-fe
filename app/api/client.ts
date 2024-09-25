import axios from 'axios';
import {
  commonErrorAuthInterceptor,
  commonResponseInterceptor,
} from './interceptors';

export const client = axios.create({
  baseURL: (typeof window === 'undefined' ? '' : '') + '/api/v1',
});

client.interceptors.response.use(
  commonResponseInterceptor,
  commonErrorAuthInterceptor,
);

export type ApiResponse = {
  isSuccess: boolean;
  error?: string;
};
