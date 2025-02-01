import React, { FC } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { cn } from '~/lib/utils';

export type ISpinnerProps = React.ComponentProps<typeof CgSpinner>;

const Spinner: FC<ISpinnerProps> = ({ className, ...props }) => (
  <CgSpinner
    {...props}
    className={cn(
      'mx-auto animate-spin text-2xl text-primary-foreground',
      className,
    )}
  />
);

export default Spinner;
