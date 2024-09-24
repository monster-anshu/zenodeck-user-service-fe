import axios from 'axios';
import { API_URI } from '~/env';
import {
  commonErrorAuthInterceptor,
  commonResponseInterceptor,
} from './interceptors';

export const client = axios.create({
  baseURL: (typeof window === 'undefined' ? API_URI : API_URI) + '/api/v1',
});

client.interceptors.response.use(
  commonResponseInterceptor,
  commonErrorAuthInterceptor
);

export type ApiResponse = {
  isSuccess: boolean;
  error?: string;
};
