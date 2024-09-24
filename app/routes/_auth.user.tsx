import { zodResolver } from '@hookform/resolvers/zod';
import type { MetaFunction } from '@remix-run/node';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserApi } from '~/api/user.api';
import ProfilePic from '~/components/ProfilePic';
import { userOptions } from '~/hooks/user';
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

export const meta: MetaFunction = () => {
  return [{ title: 'User Profile' }];
};

const schema = z.object({
  firstName: z.string().nonempty('Firstname is required'),
  lastName: z.string().nonempty('Lastname is required'),
});

export default function UserPage() {
  const userQuery = useQuery(userOptions);
  const user = userQuery.data?.user;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await UserApi.update(values);
      return res;
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    updateProfile.mutate(values);
  }

  return (
    <div className='p-8'>
      <div>
        <h2 className='text-2xl font-medium'>Profile Picture</h2>
        <p className='text-black/50'>Upload your Profile picture</p>
        <div className='py-4'>
          <ProfilePic className='text-2xl' width={60} src={user?.profilePic}>
            {user?.firstName}
          </ProfilePic>
        </div>
      </div>
      Hi ,{userQuery.data?.user.firstName}
      <div className='mt-10'>
        <h2 className='text-2xl font-medium'>Basic Info</h2>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='grid w-full max-w-xs gap-3'
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

              <Button type='submit' loading={updateProfile.isPending}>
                Save
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

const formElements: FormElement<typeof schema>[] = [
  {
    name: 'firstName',
    label: 'Firstname',
    placeholder: 'John',
    type: 'text',
  },
  {
    name: 'lastName',
    label: 'Lastname',
    placeholder: 'Doe',
    type: 'text',
  },
];
