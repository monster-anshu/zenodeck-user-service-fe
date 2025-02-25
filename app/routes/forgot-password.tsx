import { zodResolver } from '@hookform/resolvers/zod';
import { Link, MetaFunction, useNavigate } from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthApi } from '~/api/auth.api';
import OtpDialog from '~/components/OtpDialog';
import PasswordChecker from '~/components/PasswordChecker';
import { cn } from '~/lib/utils';
import { FormElement } from '~/shadcn/molecules/form-component';
import { Button } from '~/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/shadcn/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/shadcn/ui/form';
import { Input } from '~/shadcn/ui/input';

export const meta: MetaFunction = () => {
  return [{ title: 'Forgot Password' }];
};

const schema = z.object({
  emailId: z
    .string({
      required_error: 'Email id is required',
    })
    .nonempty('Email id is required')
    .email(),
  password: z.string().min(8),
  openOtpDialog: z.boolean(),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailId: '',
      password: '',
      openOtpDialog: false,
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await AuthApi.forgotPassword({
        emailId: values.emailId,
        password: values.password,
      });
      return res;
    },
    onSuccess: () => {
      form.setValue('openOtpDialog', true);
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    forgotPassword.mutate(values);
  }

  const values = form.watch();

  return (
    <div className='flex min-h-screen items-center p-4'>
      {values.openOtpDialog ? (
        <OtpDialog
          emailId={values.emailId}
          onVerified={() =>
            navigate('/login', {
              viewTransition: true,
            })
          }
        />
      ) : null}
      <Card className={cn('mx-auto w-[500px]')}>
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Please enter email to receive code to reset password
          </CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-3'
            >
              {formElements.map((item) => {
                if (item.type === 'email' || item.type === 'password') {
                  return (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem className={cn('col-span-2')}>
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

              <Button
                type='submit'
                className='col-span-2'
                loading={forgotPassword.isPending}
              >
                Reset Password
              </Button>
            </form>
            <div className='text-center text-sm'>
              <p>
                <Link
                  className='text-primary underline'
                  to={'/login'}
                  viewTransition
                >
                  Back to login
                </Link>
              </p>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

const formElements = [
  {
    name: 'emailId',
    label: 'Email',
    placeholder: 'user@example.com',
    type: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    placeholder: '********',
    type: 'password',
    autoComplete: 'new-password',
  },
] satisfies FormElement<typeof schema>[];

export default ForgotPassword;
