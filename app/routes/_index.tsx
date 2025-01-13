import { redirect, useNavigate } from '@remix-run/react';
import { FC, useEffect } from 'react';

type IHomeProps = {};

export const loader = () => {
  return redirect('/user');
};

const Home: FC<IHomeProps> = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/user', {
      replace: true,
      viewTransition: true,
    });
  }, []);

  return null;
};

export default Home;
