import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import OtpDialog from '~/components/OtpDialog';
import { Button } from '~/shadcn/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shadcn/ui/form';
import { Input } from '~/shadcn/ui/input';
import { FormElement } from '~/types';
import { userOptions } from '~/hooks/user';
import PasswordChecker from '~/components/PasswordChecker';
import { AuthApi } from '~/api/auth.api';

type IPasswordPageProps = {};

const schema = z.object({
  password: z.string().min(8, 'Password should be 8 character long.'),
  confirmPassword: z.string(),
  openOtpDialog: z.boolean(),
});

const PasswordPage: FC<IPasswordPageProps> = () => {
  const { data: user } = useQuery(userOptions);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      confirmPassword: '',
      password: '',
      openOtpDialog: false,
    },
  });

  const changePassword = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await AuthApi.changePassword(values.password);
      return res;
    },
    onSuccess() {
      form.setValue('openOtpDialog', true);
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    if (values.confirmPassword !== values.password) {
      form.setError('confirmPassword', {
        message: 'Password not matching',
      });
      return;
    }

    changePassword.mutate(values);
  }

  const values = form.watch();

  return (
    <div className='p-8'>
      {values.openOtpDialog ? <OtpDialog emailId={user?.emailId} /> : null}
      <div>
        <h2 className='text-2xl font-medium'>Change Password</h2>
        <p className='text-black/50'>Change or Update password</p>
        <div className='py-4'>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid w-full max-w-xs gap-3'
              >
                {formElements.map((item) => {
                  if (item.type === 'password' || item.type === 'text') {
                    return (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={item.placeholder}
                                type={item.type}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    );
                  }

                  return null;
                })}

                <PasswordChecker password={values.password} />

                <Button type='submit' loading={changePassword.isPending}>
                  Change
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

const formElements = [
  {
    name: 'password',
    label: 'Password',
    placeholder: '********',
    type: 'password',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: '********',
    type: 'password',
    autoComplete: 'confirm-password',
  },
] satisfies FormElement<typeof schema>[];

export default PasswordPage;
