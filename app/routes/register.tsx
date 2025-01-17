import { zodResolver } from '@hookform/resolvers/zod';
import { Link, MetaFunction, useNavigate } from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthApi } from '~/api/auth.api';
import { PRODUCT_IDS, PRODUCTS } from '~/common/products';
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

export const meta: MetaFunction = () => {
  return [{ title: 'Register' }];
};

const schema = z.object({
  countryCode: z.string().nonempty('Country code is required'),
  emailId: z.string().email({
    message: 'Invalid email',
  }),
  firstName: z.string().nonempty('Firstname is required'),
  lastName: z.string().nonempty('Lastname is required'),
  mobileNo: z.string().nonempty('Phone no is required'),
  password: z.string().min(8, {
    message: 'Password must be 8 charachter long',
  }),
  productId: z.enum(PRODUCT_IDS).optional(),
  companyName: z.string().optional(),
});

const RegisterPage = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailId: '',
    },
  });

  const register = useMutation({
    mutationFn: AuthApi.register,
    onSuccess() {
      navigate('/user', {
        viewTransition: true,
      });
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    register.mutate(values);
  }

  return (
    <div className='flex min-h-screen items-center p-4'>
      <Card className={cn('mx-auto w-[500px]')}>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new accout</CardDescription>
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
                            value={field.value}
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
                loading={register.isPending}
              >
                Register
              </Button>
            </form>
            <div className='text-center text-sm'>
              <p>
                <span>{'Already have an account ? '}</span>
                <Link
                  className='text-primary underline'
                  to={'/login'}
                  viewTransition
                >
                  Login
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
    name: 'firstName',
    label: 'Firstname',
    placeholder: 'Jone',
    type: 'text',
    className: 'col-span-1',
  },
  {
    name: 'lastName',
    label: 'Lastname',
    placeholder: 'Doe',
    type: 'text',
    className: 'col-span-1',
  },
  {
    name: 'emailId',
    label: 'Email',
    placeholder: 'user@example.com',
    type: 'email',
  },
  {
    name: 'companyName',
    label: 'Company name',
    placeholder: 'Facebook',
    type: 'text',
  },
  {
    name: 'productId',
    label: 'Product Id',
    type: 'select',
    options: PRODUCTS.map((product) => ({
      label: product.name,
      value: product.productId,
    })),
  },
  {
    name: 'mobileNo',
    type: 'text',
    label: 'Phone number',
    placeholder: '6235237273823',
  },
  {
    name: 'countryCode',
    type: 'select',
    label: 'Country',
    placeholder: 'Country',
    options: [
      {
        label: 'India',
        value: 'IN',
      },
    ],
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: '********',
  },
] satisfies FormElement<typeof schema>[];

export default RegisterPage;
