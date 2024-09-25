import { ApiResponse, client } from './client';

export class AuthApi {
  static async register(body: RegisterBody) {
    const { data } = await client.post<RegisterResponse>(
      '/user/auth/register',
      body,
    );
    return data;
  }

  static async login(body: LoginBody) {
    const { data } = await client.post<LoginResponse>('/user/auth/login', body);
    return data;
  }

  static async logout() {
    const { data } = await client.post<ApiResponse>('/user/auth/logout');
    return data;
  }

  static async forgotPassword(body: ForgotPassword) {
    const { data } = await client.post<ApiResponse>(
      '/user/auth/forgot-password',
      body,
    );
    return data;
  }

  static async changePassword(password: string) {
    const { data } = await client.post<ApiResponse>(
      '/user/auth/change-password',
      {
        password,
      },
    );
    return data;
  }
}

export type RegisterBody = {
  countryCode: string;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  password: string;
  productId?: string;
  companyName?: string;
};

export type ForgotPassword = {
  password: string;
  emailId: string;
};

type RegisterResponse = ApiResponse;

export type LoginBody = {
  emailId: string;
  password: string;
};

type LoginResponse = ApiResponse & {
  companyList: [];
};
