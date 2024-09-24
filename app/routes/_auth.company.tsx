import { useQuery } from '@tanstack/react-query';
import { FC, useState } from 'react';
import { UserCompany } from '~/api/company.api';
import CompanyDialog from '~/components/CompanyDialog';
import ProfilePic from '~/components/ProfilePic';
import { companyListOptions } from '~/hooks/user';
import { Button } from '~/shadcn/ui/button';

type ICompanyProps = {};

const Company: FC<ICompanyProps> = () => {
  const { data } = useQuery(companyListOptions);
  const [selectedCompany, setSelectedCompany] = useState(
    null as null | UserCompany
  );

  return (
    <div className='p-8'>
      {selectedCompany ? (
        <CompanyDialog
          company={selectedCompany}
          onHide={() => setSelectedCompany(null)}
        />
      ) : null}
      <h2 className='text-2xl font-medium'>Company Settings</h2>
      <p className='text-black/50'>Manage Company Name,Products, Logos</p>
      <div className='py-4'>
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
                <p className='mt-1 text-xs text-black/70'>Registered with</p>
                <p className='text-sm'>{company.allowedProductIds.join(' ')}</p>
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