import { ApiResponse, client } from './client';

export class UserApi {
  static async info() {
    const { data } = await client.get<InfoResponse>('/user/info');
    return data;
  }

  static async update(body: Pick<User, 'firstName' | 'lastName'>) {
    const { data } = await client.patch<UpdateReponse>('/user/update', body);
    return data;
  }
}

export interface InfoResponse {
  user: User;
}

type UpdateReponse = ApiResponse & {
  user: User;
};

export interface User {
  _id: string;
  countryCode: string;
  emailId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  profilePic?: string;
}
