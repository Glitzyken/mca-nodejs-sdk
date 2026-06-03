export const PRODUCTS_RECOMMENDED = {
  AUTO: {},
  HEALTH: {
    FlexiCareMiniRetail: 'f7b4bca1-b870-4648-8704-11c1802a51d0',
  },
  GADGET: {},
};

export const PRODUCT_CATEGORIES = {
  Package: '14fb5968-48d2-49ac-88a8-0ee40e01fcca',
  Gadget: '1e87194d-5eb1-48b6-8837-a9cbc78d4ec3',
  'Agency Banking': '62d58862-38dd-4d9c-affc-95102e8fbc8b',
  Life: '704f6261-3710-48e5-a894-ffc4d6bdc381',
  'Credit Life': '814f6261-3710-48e5-a894-ffc4d6bdc381',
  Auto: '978ced0d-0e05-4de6-b43a-b408c0e8b95e',
  Health: '9d78bc79-3fa8-447d-b688-e42c1c6838a0',
  Content: '9e9d5fe0-2129-41a5-9f44-9c9fe90b3855',
  Travel: 'f3933c0d-ef7c-4287-90bd-744cf00c8426',
} as const;

export const ENDPOINTS = {
  // products
  getAllProducts: '/products/all',
  getOneProduct: '/products/:id',

  // purchase and renewal
  getPremium: '/products/compute-price',
  buyProduct: '/products/buy',
  renewProduct: '/products/renew/:id',

  // utilities
  getUtility: '/products/utility/:id',
} as const;
