import { MetaFunction } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { UserCompany } from '~/api/company.api';
import { PRODUCTS } from '~/common/products';
import CompanyDialog from '~/components/CompanyDialog';
import ProductChip from '~/components/ProductChip';
import ProfilePic from '~/components/ProfilePic';
import { companyListOptions } from '~/hooks/user';
import { Button } from '~/shadcn/ui/button';
import Spinner from '~/shadcn/ui/spinner';

type ICompanyProps = {};

export const meta: MetaFunction = () => {
  return [{ title: 'Company' }];
};

const Company: FC<ICompanyProps> = () => {
  const { data, isLoading } = useQuery(companyListOptions);
  const [selectedCompany, setSelectedCompany] = useState(
    null as null | UserCompany,
  );

  if (isLoading) {
    return <Spinner className='my-4' />;
  }

  return (
    <div className='p-8'>
      {selectedCompany ? (
        <CompanyDialog
          company={selectedCompany}
          onHide={() => setSelectedCompany(null)}
        />
      ) : null}
      <h2 className='text-2xl font-medium'>Company Settings</h2>
      <p className='text-foreground'>Manage Company Name,Products, Logos</p>
      <div className='py-6'>
        {data?.map((company) => {
          return (
            <div key={company._id} className='flex rounded-lg border-2'>
              <div className='border-r-2 p-2'>
                <ProfilePic src={company.companyLogo} width={90}>
                  {company.companyName}
                </ProfilePic>
              </div>
              <div className='flex-1 p-4'>
                <p className='text-sm font-medium'>{company.companyName}</p>
                <p className='mt-1 text-xs text-foreground/70'>
                  Product Access
                </p>
                <div className='mt-2 text-sm'>
                  {PRODUCTS.map((product) => (
                    <ProductChip
                      added={company.allowedProductIds.includes(
                        product.productId,
                      )}
                      companyId={company._id}
                      id={product.productId}
                      label={product.name}
                    />
                  ))}
                </div>
              </div>
              <div className='p-3'>
                <Button onClick={() => setSelectedCompany(company)}>
                  Manage
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Company;
