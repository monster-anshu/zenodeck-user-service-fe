import { ApiResponse, client } from './client';

export class CompanyApi {
  static async list() {
    const { data } =
      await client.get<CompanyListResponse>('/user/company/list');
    return data;
  }

  static async update({ companyId, ...body }: UpdateCompanyBody) {
    const { data } = await client.patch<UpdateCompanyResponse>(
      `/user/company/${companyId}/update`,
      body
    );
    return data.companyInfo;
  }
}

type CompanyInfo = {
  _id: string;
  companyName: string;
  primaryUserID: string;
  status: string;
  companyLogo: string;
};

type UpdateCompanyBody = {
  companyId: string;
  companyName: string;
  companyLogo?: string | null;
};

type UpdateCompanyResponse = ApiResponse & {
  companyInfo: CompanyInfo;
};

type CompanyListResponse = ApiResponse & {
  companyList: UserCompany[];
};

export type UserCompany = {
  _id: string;
  companyName: string;
  companyLogo?: string;
  isOwner: boolean;
  allowedProductIds: string[];
};
