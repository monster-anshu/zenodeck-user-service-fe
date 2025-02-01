import { CAMPAIGN_URL } from '~/env';

export const PRODUCTS = [
  {
    name: 'Campaign',
    productId: 'CAMPAIGN',
  },
  //   hide under develop products
  //   {
  //     name: 'Bookings',
  //     productId: 'BOOKINGS',
  //   },
  //   {
  //     name: 'Projects',
  //     productId: 'PROJECTS',
  //   },
] as const;

export const PRODUCT_IDS = [
  'CAMPAIGN',
  // 'BOOKINGS', 'BOOKINGS'
] as const;
export type PRODUCT_ID = (typeof PRODUCT_IDS)[number];

export const PRODUCTS_URL = {
  CAMPAIGN: CAMPAIGN_URL,
};
