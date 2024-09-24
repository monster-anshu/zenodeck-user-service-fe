import { redirect } from '@remix-run/react';
import { FC } from 'react';

type IHomeProps = {};

export const loader = () => {
  return redirect('/user');
};

const Home: FC<IHomeProps> = () => {
  return <div>Home</div>;
};

export default Home;
