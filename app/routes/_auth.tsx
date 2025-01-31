import { Outlet } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import UserSidebar from '~/components/UserSidebar';
import { userOptions } from '~/hooks/user';
import Spinner from '~/shadcn/ui/spinner';

const Auth = () => {
  const userQuery = useQuery(userOptions);

  if (userQuery.isLoading) {
    return <Spinner className='my-4' />;
  }

  return (
    <div className='flex min-h-screen'>
      <UserSidebar />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
