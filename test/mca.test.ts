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

describe('Input Validation Errors', () => {
  it('should throw an error if API key is not passed', () => {
    expect(() => MyCoverAi.setApiKey(undefined as any)).toThrow(
      'API Key is required',
    );
  });

  it('should throw an error if product IDs are not passed', () => {
    expect(() => MyCoverAi.setProducts(undefined as any)).toThrow(
      'Please provide at least one product ID',
    );
  });

  it('should throw an error if category is not passed', () => {
    expect(() => MyCoverAi.setCategory(undefined as any)).toThrow(
      'Please provide a category',
    );
  });
});
