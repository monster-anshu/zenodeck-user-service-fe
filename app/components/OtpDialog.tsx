import { useMutation } from '@tanstack/react-query';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { FC, useState } from 'react';
import { OtpApi } from '~/api/otp.api';
import { Button } from '~/shadcn/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shadcn/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '~/shadcn/ui/input-otp';
import { maskEmail } from '~/utils/mask';

type IOtpDialogProps = {
  onHide?: () => void;
  onVerified?: () => void;
  emailId?: string;
};

const OtpDialog: FC<IOtpDialogProps> = ({ onHide, emailId, onVerified }) => {
  const [value, setValue] = useState('');

  const otpVerify = useMutation({
    mutationFn: OtpApi.verify,
    onSuccess: () => {
      onVerified?.();
    },
  });

  const handleSubmit = () => {
    if (value.length !== 6) {
      return;
    }
    otpVerify.mutate(value);
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onHide?.();
        }
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>One time password</DialogTitle>
          <DialogDescription>
            An one time password has been sent to for email{' '}
            {emailId ? <b>{maskEmail(emailId)}</b> : ''}.
          </DialogDescription>
        </DialogHeader>
        <div className='py-4'>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={value}
            onChange={(value) => setValue(value.toUpperCase())}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} loading={otpVerify.isPending}>
            Validate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OtpDialog;
