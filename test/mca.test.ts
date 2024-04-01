import MyCoverAi from '../src';

const API_KEY = 'MCASECK_TEST|d20f5a60-dee0-4a55-846d-29fe833786e8';

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
