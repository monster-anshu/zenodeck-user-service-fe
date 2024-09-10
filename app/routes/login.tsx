import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthApi } from '~/api/auth';
import { cn } from '~/lib/utils';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/shadcn/ui/select';
import { FormElement } from '~/types';

const PRODUCT_IDS = ['BOOKINGS', 'PROJECTS'] as const;

const schema = z.object({
  emailId: z.string().email({
    message: 'Invalid email',
  }),
  productId: z.enum(PRODUCT_IDS).optional(),
  password: z.string().min(8, {
    message: 'Password must be 8 charachter long',
  }),
});

const LoginPage = () => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailId: '',
    },
  });

  const login = useMutation({
    mutationFn: AuthApi.login,
  });

  function onSubmit(values: z.infer<typeof schema>) {
    login.mutate(values);
  }

  return (
    <div className='flex min-h-screen items-center p-4'>
      <Card className={cn('mx-auto w-[500px]')}>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign-in with your account</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid grid-cols-2 gap-3'
            >
              {formElements.map((item) => {
                if (
                  item.type === 'email' ||
                  item.type === 'password' ||
                  item.type === 'text'
                ) {
                  return (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem className={cn('col-span-2', item.className)}>
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

                if (item.type === 'select') {
                  return (
                    <FormField
                      control={form.control}
                      name={item.name}
                      key={item.name}
                      render={({ field }) => (
                        <FormItem className={cn('col-span-2', item.className)}>
                          <FormLabel>{item.label}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={item.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {item.options.map((option) => {
                                return (
                                  <SelectItem
                                    value={option.value}
                                    key={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }
                return null;
              })}

              <Button
                type='submit'
                className='col-span-2'
                loading={login.isPending}
              >
                Signin
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

const formElements: FormElement<typeof schema>[] = [
  {
    name: 'emailId',
    label: 'Email',
    placeholder: 'user@example.com',
    type: 'email',
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '********',
  },
  {
    name: 'productId',
    label: 'Product Id',
    type: 'select',
    options: [
      {
        label: 'Bookings',
        value: 'BOOKINGS',
      },
      {
        label: 'Projects',
        value: 'PROJECTS',
      },
    ],
  },
];

export default LoginPage;
