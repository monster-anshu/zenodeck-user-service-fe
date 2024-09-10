import type { MetaFunction } from '@remix-run/node';
import { useQuery } from '@tanstack/react-query';
import UserSidebar from '~/components/UserSidebar';
import { userOptions } from '~/hooks/user';
import { Button } from '~/shadcn/ui/button';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const userQuery = useQuery(userOptions);

  return (
    <div>
      <UserSidebar />
    </div>
  );
}
