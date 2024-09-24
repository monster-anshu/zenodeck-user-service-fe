import { Outlet } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { PiSpinnerGapLight } from 'react-icons/pi';
import UserSidebar from '~/components/UserSidebar';
import { userOptions } from '~/hooks/user';

const Auth = () => {
  const userQuery = useQuery(userOptions);

  if (userQuery.isLoading) {
    return <PiSpinnerGapLight className='mx-auto my-5 animate-spin text-3xl' />;
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
