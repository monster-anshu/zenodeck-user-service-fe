import { zodResolver } from '@hookform/resolvers/zod';
import {
  Link,
  MetaFunction,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthApi } from '~/api/auth.api';
import {
  PRODUCT_ID,
  PRODUCT_IDS,
  PRODUCTS,
  PRODUCTS_URL,
} from '~/common/products';
import { cn } from '~/lib/utils';
import { FormComponent, FormElement } from '~/shadcn/molecules/form-component';
import { Button } from '~/shadcn/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/shadcn/ui/card';
import { Form } from '~/shadcn/ui/form';
import { createURLObject, redirectWindow } from '~/utils/url';

export const meta: MetaFunction = () => {
  return [{ title: 'Login' }];
};

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productIdParam = searchParams.get('productId');

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      emailId: '',
      password: '',
      productId: PRODUCT_IDS.includes(productIdParam as never)
        ? (productIdParam as PRODUCT_ID)
        : PRODUCT_IDS[0],
    },
  });

  const login = useMutation({
    mutationFn: AuthApi.login,
    async onSuccess(_, { productId }) {
      const redirect = createURLObject(
        decodeURIComponent(searchParams.get('redirect') || ''),
      );

      if (redirect) {
        await redirectWindow(redirect, true);
        return;
      }

      if (productId) {
        await redirectWindow(PRODUCTS_URL[productId], true);
        return;
      }

      navigate('/user', {
        viewTransition: true,
      });
    },
    onError(error) {
      toast.error(error.message);
    },
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
                return <FormComponent element={item} key={item.name} />;
              })}

              <Button
                type='submit'
                className='col-span-2'
                loading={login.isPending}
              >
                Signin
              </Button>
            </form>
            <div className='text-center text-sm'>
              <p>
                <Link
                  className='text-primary underline'
                  to={'/forgot-password'}
                  viewTransition
                >
                  Forgot password ?
                </Link>
              </p>
              <p>
                <span>{"Don't have an account ? "}</span>
                <Link
                  className='text-primary underline'
                  to={'/register'}
                  viewTransition
                >
                  Register
                </Link>
              </p>
            </div>
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
    options: PRODUCTS.map((product) => ({
      label: product.name,
      value: product.productId,
    })),
  },
];

export default LoginPage;
