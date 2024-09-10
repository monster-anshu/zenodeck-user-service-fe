import { queryOptions } from '@tanstack/react-query';
import { UserApi } from '~/api/user';

export const userOptions = queryOptions({
  queryKey: ['user-info'],
  queryFn: async () => {
    const res = await UserApi.info();
    return res;
  },
});
