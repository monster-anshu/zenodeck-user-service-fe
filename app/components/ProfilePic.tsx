import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IProfilePicProps extends React.ComponentProps<'div'> {
  children?: string | null;
  src?: string | null;
  width?: string | number;
}

const ProfilePic: FC<IProfilePicProps> = ({
  children,
  className,
  src,
  width = 34,
  ...props
}) => {
  if (src)
    return (
      <img
        width={width}
        height={width}
        src={src}
        className='rounded-full object-cover'
        alt={'Profile Pic'}
      />
    );

  return (
    <div
      {...props}
      className={twMerge(
        'text-20 grid place-items-center rounded-full bg-primary/10 font-medium text-primary/80',
        className,
      )}
      style={{
        width: width,
        height: width,
      }}
    >
      {children?.[0]?.toUpperCase()}
    </div>
  );
};
export default ProfilePic;
