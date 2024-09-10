import React, { FC } from 'react';
import { CiUser } from 'react-icons/ci';
import { BsKey } from 'react-icons/bs';
import { SiAwsorganizations } from 'react-icons/si';
import { Link, useLocation } from '@remix-run/react';
import { cn } from '~/lib/utils';

type IUserSidebarProps = {};

const options = [
  {
    link: '/',
    icon: <CiUser />,
    label: 'User',
  },
  {
    link: '/password',
    icon: <BsKey />,
    label: 'User',
  },
  {
    link: '/orgnaization',
    icon: <SiAwsorganizations />,
    label: 'Orgnaization',
  },
];

const UserSidebar: FC<IUserSidebarProps> = () => {
  const location = useLocation();
  console.log(location);
  return (
    <div className='w-72'>
      {options.map((option) => {
        const isActive = location.pathname === option.link;
        return (
          <Link
            to={option.link}
            key={option.link}
            className={cn(
              'flex items-center justify-start gap-2 border px-4 py-3 font-medium',
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
