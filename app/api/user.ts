import { client } from './client';

export class UserApi {
  static async info() {
    const { data } = await client.get<InfoResponse>('/user/info');
    return data;
  }
}

export interface InfoResponse {
  user: User;
}

export interface User {
  _id: string;
  countryCode: string;
  emailID: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
