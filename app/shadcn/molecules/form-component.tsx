import { useFormContext } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
import {
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

const FormComponent = <Element extends FormElement<z.ZodAny>>({
  element: item,
}: {
  element: Element;
}) => {
  const form = useFormContext();
  if (
    item.type === 'email' ||
    item.type === 'password' ||
    item.type === 'text'
  ) {
    return (
      <FormField
        control={form.control}
        name={item.name.toString()}
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
        name={item.name.toString()}
        render={({ field }) => (
          <FormItem className={cn('col-span-2', item.className)}>
            <FormLabel>{item.label}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={item.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {item.options.map((option) => {
                  return (
                    <SelectItem value={option.value} key={option.value}>
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

  return <div>Not Implemented</div>;
};

export { FormComponent };

// types
import type { ReactNode } from 'react';
import { cn } from '~/lib/utils';

type Option = {
  label: ReactNode;
  value: string;
};

export type FormElement<T extends ZodSchema> = Record<string, unknown> & {
  name: keyof z.infer<T>;
  label: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
} & (
    | { type: 'text' | 'email' | 'password' }
    | { type: 'select'; options: Option[] }
    | { type: 'file'; module?: string }
  );
