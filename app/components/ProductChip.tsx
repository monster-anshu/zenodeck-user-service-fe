import { useMutation } from '@tanstack/react-query';
import { FC } from 'react';
import { LuCircleCheckBig, LuSquarePlus } from 'react-icons/lu';
import { CompanyApi } from '~/api/company.api';
import { Button } from '~/shadcn/ui/button';
type IProductChipProps = {
  id: string;
  label: string;
  added: boolean;
  companyId: string;
};

const ProductChip: FC<IProductChipProps> = ({
  id,
  label,
  added,
  companyId,
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await CompanyApi.addProduct({ companyId, productId: id });
    },
  });
  return (
    <div className='flex items-center gap-1'>
      <p>{label}</p>
      {added ? (
        <LuCircleCheckBig className='text-green-500' />
      ) : (
        <Button
          loading={isPending}
          onClick={() => mutate()}
          className='h-auto min-h-0 p-1'
          variant={'ghost'}
        >
          <LuSquarePlus />
        </Button>
      )}
    </div>
  );
};

export default ProductChip;
