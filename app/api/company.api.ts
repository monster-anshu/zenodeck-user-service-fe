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
      body,
    );
    return data.companyInfo;
  }

  static async addProduct({ companyId, productId }: AddProductBody) {
    const { data } = await client.post(
      `/user/company/${companyId}/create-product`,
      { productId },
    );
    return data;
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

type AddProductBody = {
  companyId: string;
  productId: string;
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
