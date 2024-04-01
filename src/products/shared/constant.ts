export const activeProductsIds = {
  MyCoverGeniusFlexiCare: 'e6b4bca1-b870-4648-8704-11c1802a51d0',
  MyCoverGeniusFlexiCareMini: 'f7b4bca1-b870-4648-8704-11c1802a51d0',
  WellaHealthMalariaCover: 'fab6bda1-b870-4648-8704-11c1802a51d0',
  MyCoverGeniusMiniComprehensive: '0ced01f3-7698-4101-a244-dd5d70e974c4',
  MyCoverGeniusGadgetCover: 'ffb0711c-1e4a-453b-a26c-2726e0a1a7bb',
};

export const productsCategories = {
  Package: 'Package',
  Gadget: 'Gadget',
  AgencyBanking: 'Agency Banking',
  Life: 'Life',
  Auto: 'Auto',
  Health: 'Health',
  Content: 'Content',
  Travel: 'Travel',
  CreditLife: 'Credit Life',
};

// ENDPOINTS URLS
export const purchaseEndpoints: { [key: string]: string } = {
  /** MyCoverGenius FlexiCare */
  'e6b4bca1-b870-4648-8704-11c1802a51d0': '/products/mcg/buy-health',
  /**  Wella Health Malaria Cover */
  'fab6bda1-b870-4648-8704-11c1802a51d0': '/products/wella/buy-health-malaria',
};

export const productsEndpoints = {
  getAllProducts: '/products/get-all-products',
};

export const auxiliaryEndpoints = {
  getColors: '/color-list',
  getGenders: '/genders',
  getVehicleType: '/vehicle-body-types',
  getManufactureYear: '/manufacture-year',
};
