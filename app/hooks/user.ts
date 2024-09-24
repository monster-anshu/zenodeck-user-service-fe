import { queryOptions } from '@tanstack/react-query';
import { CompanyApi } from '~/api/company.api';
import { UserApi } from '~/api/user.api';

export const userOptions = queryOptions({
  queryKey: ['user-info'],
  refetchOnMount: false,
  queryFn: async () => {
    const res = await UserApi.info();
    return res;
  },
});

export const companyListOptions = queryOptions({
  queryKey: ['company-list'],
  queryFn: async () => {
    const res = await CompanyApi.list();
    return res.companyList;
  },
});
