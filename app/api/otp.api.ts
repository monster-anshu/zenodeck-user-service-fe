import { ApiResponse, client } from './client';

export class OtpApi {
  static async verify(otp: string) {
    const { data } = await client.post<ApiResponse>('/user/otp/verify', {
      otp,
    });
    return data;
  }
}
