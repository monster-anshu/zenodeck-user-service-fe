import { FC } from 'react';
import { CiUser } from 'react-icons/ci';
import { BsKey, BsPower } from 'react-icons/bs';
import { SiAwsorganizations } from 'react-icons/si';
import { Link, useLocation, useNavigate } from '@remix-run/react';
import { cn } from '~/lib/utils';
import { AuthApi } from '~/api/auth.api';

type IUserSidebarProps = {};

const UserSidebar: FC<IUserSidebarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const options = [
    {
      link: '/user',
      icon: <CiUser />,
      label: 'User',
    },
    {
      link: '/password',
      icon: <BsKey />,
      label: 'Password',
    },
    {
      link: '/company',
      icon: <SiAwsorganizations />,
      label: 'Company',
    },
    {
      link: '#',
      icon: <BsPower />,
      label: 'Logout',
      onClick: async () => {
        await AuthApi.logout();
        navigate('/');
      },
    },
  ];

  return (
    <div className='w-72 border-r-2'>
      {options.map((option) => {
        const isActive = location.pathname === option.link;
        return (
          <Link
            to={option.link}
            key={option.link}
            onClick={option.onClick}
            className={cn(
              'flex items-center justify-start gap-2 border-b-2 px-4 py-3 font-medium',
              isActive ? 'text-primary' : ''
            )}
          >
            <span className='text-lg'>{option.icon}</span>
            <span>{option.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default UserSidebar;
