export const PRODUCTS_RECOMMENDED = {
  AUTO: {
    CoronationComprehensiveAuto: '45140c74-fc6f-42f5-a0d2-66800b22d999',
    CoronationMotorMaxBronze: '4a62409b-442d-474f-b1bb-de6dc43df4ba',
    CoronationMotorMaxSilver: 'ea93d1b3-a2ab-4291-bc1f-fc7e2ccdcf9a',
    CoronationMotorMaxGold: 'd6d1efa6-9dc1-4c94-ba7a-25fdcc8f66e2',
    MiniComprehensiveAuto: '0ced01f3-7698-4101-a244-dd5d70e974c4',
    MicroComprehensiveAuto: 'b0d0f4ad-0b8a-452f-a876-78bef8de3873',
    MonthlyComprehensiveAuto: 'b0d0f39c-0b8a-452f-a876-78bef8de3862',
    ThirdPartyAuto: '56240c74-fc6f-42f5-a0d2-66800b22d99a',
    ThirdPartyBikeCover: 'c1e1f39c-0b8a-452f-a876-78bef8de4973',
    AIICOComprehensiveAuto: '24140c74-fc6f-42f5-a0d2-24800b22d80a',
    STIComprehensiveAuto: 'b0d0f39c-0b8a-452f-a876-78bef8de3347',
    SanlamComprehensiveAuto: 'c94e6f4d-e868-4782-bb35-df6e3344ae7e',
  },
  HEALTH: {
    PrimeCare: '9786b349-3819-4fe3-8987-96b4d6214143',
    PrimeCarePlus: '0521ffe3-e7c1-4bfa-b90e-d69ab311ec98',
    FlexiCareMiniRetail: 'f7b4bca1-b870-4648-8704-11c1802a51d0',
    FlexiCareRetail: 'e6b4bca1-b870-4648-8704-11c1802a51d0',
    Seniors: '807dca29-d514-415d-abd9-1d2b9c532939',
    SeniorsPlus: '604dca29-d514-415d-abd9-1d2b9c532844',
    SeniorsPrime: '602dca29-d514-415d-abd9-1d2b9c532454',
    ZenCareRetail: '7b6f82a3-c4bc-446d-9b81-4fa0849a1de1',
    ZenCarePlusRetail: 'cf74abd4-4727-43dc-b8d5-ca6fd824538b',
    ZenCarePrimeRetail: '901dca29-d514-415d-abd9-1d2b9c532828',
  },
  GADGET: {
    DeviceCover: '46240c74-fc6f-42f5-a0d2-66800b22d9aa',
    FlexiGuard: '88e7008e-0cb6-4559-a146-ee2bb9770c71',
    FlexiGuardMini: '1bd9437e-3654-49fc-88bb-ef270cd64c21',
    FlexiGuardPlus: '01d11296-8f05-4ca6-9f8b-cb49d1e8b035',
    LaptopInsuranceBasic: '5776bfc5-a387-4980-8ca4-708c0f083314',
    LaptopInsuranceStandard: '5886bfc5-a387-4980-8ca4-708c0f083325',
    PrimeProtect: 'ba773a8f-2072-4fa2-a8fb-bc7e0ab1e7b3',
    PrimeProtectPlus: '4ee0455d-2ffb-4b3b-8849-935d6269d9ad',
  },
  LIFE: {
    LifeCover: '77240c74-fc6f-42f5-b2d2-66800b22d9bb',
    AccidentCover: 'c94e6f5e-e868-4782-bb35-df6e3344ae7d',
    CreditLife: 'f8b5bca1-b870-4648-8704-11c1802a51d0',
    CredPlus: '832df321-5e01-48a8-9f4d-7abfccf994be',
    DefaultCreditLife: '40a56210-0f8d-4728-9162-268ad50ae87e',
    FlexiMoveBasic: '1979d44d-a487-4b9a-a94a-ca14221eabe1',
    FlexiMoveEssential: '246bab8b-25f1-4eba-a899-27990eddc0d3',
    FlexiMovePlus: 'a3af8e07-2741-45d2-ab80-e515736d320d',
    HospicashBasic: 'e638db01-bfe0-4c2b-a479-0d966fdabfb4',
    HospicashEssential: 'fee7407a-2593-4571-869d-9cfba5fcdc0e',
    HospicashPlus: '62543e4a-1a89-4977-8c6c-3488ab05bcb4',
    HospitalCashCover: 'cfee22e7-5aa1-4413-ba66-8ac5d550c69e',
    PersonalAccidentCover: '88240c74-fc6f-42f5-b2d2-77800b22d911',
  },
  TRAVEL: {
    TravelCover: 'c0e104ad-0b8a-452f-a876-78bef8dde1db',
  },
  PACKAGE: {
    MarineCoverCappedImportAndExport: '252c66de-6e87-4109-a515-83ee142fe70c',
    MarineCoverImportAndExport: 'd2e1f4ad-0b8a-452f-a876-78bef8dde1d9',
    OnDemandGoodsInTransit: 'e6bd69d9-eaa7-4420-a2dd-7f3305bd5b80',
    OnDemandGoodsInTransitCapped: '4ca89151-78e9-4cda-9a3b-20f759f89a41',
  },
  CONTENT: {
    BuildingCover: '59340c74-fc6f-42f5-a0d2-66800b22dacc',
    CoronationHomeContentCover: '48340c74-fc6f-42f5-a0d2-66800b22dabb',
    AIICOHomeContentCover: '0386fe30-a3be-4ff2-a64a-048d2c99504b',
    SanlamHomeContentCover: 'da5f7f6f-e868-4782-bb35-df6e3344ae7d',
    ShopContentCover: '58a6df7e-87f4-40e8-bf78-5b1f85c6d87f',
  },
} as const;

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

  // buy/renew
  getPremium: '/products/compute-price',
  buyProduct: '/products/buy',
  renewProduct: '/products/renew/:id',

  // policies
  getAllPolicies: '/policies',
  getOnePolicy: '/policies/:id',

  // purchases
  getAllPurchases: '/purchases',
  getOnePurchase: '/purchases/:id',

  // claims
  getAllClaims: '/claims',
  getOneClaim: '/claims/:id',

  // customers
  getAllCustomers: '/customers',
  getOneCustomer: '/customers/:id',
  getCustomerPurchases: '/customers/:id/purchases',
  getCustomerPolicies: '/customers/:id/policies',

  // utilities
  getUtility: '/products/utility/:id',
} as const;
