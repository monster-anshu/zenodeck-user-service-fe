import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/shadcn/ui/dialog';
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
import Upload from './fileUpload/Upload';
import FileUploadApi from '~/api/file-upload.api';
import { Button } from '~/shadcn/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CompanyApi, UserCompany } from '~/api/company.api';
import { produce } from 'immer';
import { companyListOptions } from '~/hooks/user';

type ICompanyDialogProps = {
  company: UserCompany;
  onHide?: () => void;
};

const schema = z.object({
  companyName: z.string().nonempty(),
  companyLogo: z.string().nullable(),
});

const CompanyDialog: FC<ICompanyDialogProps> = ({ company, onHide }) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyLogo: company.companyLogo || null,
      companyName: company.companyName,
    },
  });

  const queryClient = useQueryClient();

  const updateCompany = useMutation({
    mutationFn: CompanyApi.update,
    onSuccess(data) {
      queryClient.setQueryData(companyListOptions.queryKey, (old = []) => {
        return produce(old, (draft) => {
          const index = draft.findIndex((item) => item._id === data._id);
          const curr = draft[index];
          if (!curr) return;
          draft[index] = {
            ...curr,
            ...data,
          };
        });
      });
      onHide?.();
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    updateCompany.mutate({
      companyId: company._id,
      ...values,
      companyLogo: values.companyLogo || undefined,
    });
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
          <DialogTitle>Company Information</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-3'>
              {formElements.map((item) => {
                if (item.type === 'text') {
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
                              className='w-full'
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

                if (item.type === 'file') {
                  return (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <FormControl>
                            <Upload
                              accept='image/*'
                              fileCheckRegex={/\.(jpg|jpeg|gif|png)$/}
                              fileInfo={{
                                type: 'img',
                                maxSize: 5,
                                // height: 90,
                                // width: 90,
                              }}
                              clickable={false}
                              className='rounded-lg border'
                              onUpload={(file) => {
                                form.setValue(field.name, file.url);
                              }}
                              uploadFn={FileUploadApi.upload}
                            >
                              {({ open }) => {
                                return (
                                  <div className='flex items-center justify-between p-2'>
                                    {field.value ? (
                                      <>
                                        <img
                                          src={field.value}
                                          alt='Company name'
                                          width={90}
                                          height={90}
                                        />
                                      </>
                                    ) : (
                                      <div className=''>No image</div>
                                    )}
                                    <Button onClick={open}>Upload</Button>
                                  </div>
                                );
                              }}
                            </Upload>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }
                return null;
              })}
              <Button loading={updateCompany.isPending} type='submit'>
                Update
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const formElements = [
  {
    name: 'companyLogo',
    type: 'file',
    label: 'Company Logo',
  },
  {
    name: 'companyName',
    type: 'text',
    label: 'Company Name',
  },
] satisfies FormElement<typeof schema>[];

export default CompanyDialog;
