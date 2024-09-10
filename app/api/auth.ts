import { ApiResponse, client } from './client';

export class AuthApi {
  static async register(body: RegisterBody) {
    const { data } = await client.post<RegisterResponse>(
      '/user/auth/register',
      body
    );
    return data;
  }

  static async login(body: LoginBody) {
    const { data } = await client.post<LoginResponse>('/user/auth/login', body);
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

type RegisterResponse = ApiResponse;

export type LoginBody = {
  emailId: string;
  password: string;
};

type LoginResponse = ApiResponse & {
  companyList: [];
};
