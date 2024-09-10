import axios from 'axios';
import { API_URI } from '~/env';

export const client = axios.create({
  baseURL: (typeof window === 'undefined' ? API_URI : '') + '/api/v1',
});

export type ApiResponse = {
  isSuccess: boolean;
};
