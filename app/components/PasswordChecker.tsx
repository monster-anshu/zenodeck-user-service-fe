import { FC } from 'react';
import { GoDotFill } from 'react-icons/go';
import { LuCheckCircle2 } from 'react-icons/lu';
import { cn } from '~/lib/utils';

type IPasswordCheckerProps = {
  password?: string;
};

const PasswordChecker: FC<IPasswordCheckerProps> = ({ password = '' }) => {
  const checks = [
    {
      label: '8 characters long',
      isValid: password.length > 7,
    },
    {
      label: 'contain at least one number',
      isValid: /\d/.test(password),
    },
    {
      label: 'one uppercase letter(A-Z)',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: 'one lowercase letter(a-z)',
      isValid: /[a-z]/.test(password),
    },
    {
      label: 'one special character',
      isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <div className='space-y-1'>
      {checks.map((check, index) => {
        return (
          <div
            key={index}
            className={cn(
              'flex items-center justify-start gap-2 text-sm',
              check.isValid ? 'text-green-500' : 'text-gray-500'
            )}
          >
            {!check.isValid ? <GoDotFill /> : <LuCheckCircle2 />}
            <span>{check.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordChecker;
