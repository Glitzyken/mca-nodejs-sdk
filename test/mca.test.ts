import MyCoverAi from '../src';

const API_KEY = 'MCASECK_TEST|38eb6089-90f3-430b-8033-76117307e42a';

beforeAll(() => {
  MyCoverAi.setApiKey(API_KEY);
});

describe('Properties', () => {
  it('products', () => {
    const { products } = MyCoverAi;

    expect(products).toBeDefined();
    expect(MyCoverAi.products).toHaveProperty('myCoverGeniusFlexiCare');
    expect(MyCoverAi.products).toHaveProperty('myCoverGeniusFlexiCare.id');
    expect(MyCoverAi.products).toHaveProperty('myCoverGeniusFlexiCare.name');
    expect(MyCoverAi.products).toHaveProperty('myCoverGeniusFlexiCare.form');
  });
});

describe('/Get all products', () => {
  it('Should return all products', async () => {
    const res = await MyCoverAi.getProducts();
    expect(res.data).toBeTruthy();
    expect(res.data).toBeInstanceOf(Array);
  });
});
