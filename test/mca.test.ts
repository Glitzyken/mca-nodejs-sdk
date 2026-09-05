import MyCoverAi, { PRODUCT_CATEGORIES } from '../src';
import { FetchClient } from '../src/utils/client';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** A syntactically valid UUID v4 used as a generic test ID. */
const VALID_UUID = '45140c74-fc6f-42f5-a0d2-66800b22d999';
const VALID_UUID_2 = '9786b349-3819-4fe3-8987-96b4d6214143';
const INVALID_UUID = 'not-a-valid-uuid';
const VALID_DATE = '2024-01-15';
const INVALID_DATE = '15-01-2024'; // wrong format

const TEST_API_KEY = 'FAKE_API_KEY';

// ---------------------------------------------------------------------------
// Mock FetchClient so no real HTTP requests are made.
// We spy on prototype methods so each test can configure return values.
// ---------------------------------------------------------------------------

let mca: MyCoverAi;
let mockGet: jest.SpyInstance;
let mockPost: jest.SpyInstance;

// ---------------------------------------------------------------------------
// Setup per test
// ---------------------------------------------------------------------------

beforeEach(() => {
  mca = new MyCoverAi(TEST_API_KEY);
  mockGet = jest.spyOn(FetchClient.prototype, 'get');
  mockPost = jest.spyOn(FetchClient.prototype, 'post');
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ===========================================================================
// 1. Constructor
// ===========================================================================

describe('MyCoverAi Constructor', () => {
  it('should throw SDK Error when no key is provided', () => {
    expect(() => new MyCoverAi(undefined as any)).toThrow(
      'SDK Error: API Key is required',
    );
  });

  it('should throw SDK Error when an empty string is provided', () => {
    expect(() => new MyCoverAi('')).toThrow('SDK Error: API Key is required');
  });

  it('should return a MyCoverAi instance when a valid key is provided', () => {
    const instance = new MyCoverAi(TEST_API_KEY);
    expect(instance).toBeInstanceOf(MyCoverAi);
  });
});

// ===========================================================================
// 2. setProducts
// ===========================================================================

describe('setProducts', () => {
  it('should throw when no product IDs are provided', () => {
    expect(() => mca.setProducts(undefined as any)).toThrow(
      'SDK Error: Please provide at least one product ID',
    );
  });

  it('should throw when an empty array is provided', () => {
    expect(() => mca.setProducts([])).toThrow(
      'SDK Error: Please provide at least one product ID',
    );
  });

  it('should return the instance (fluent interface) when valid UUIDs are provided', () => {
    const result = mca.setProducts([VALID_UUID]);
    expect(result).toBe(mca);
  });

  it('should throw an error listing invalid UUIDs when any is invalid', () => {
    expect(() => mca.setProducts([INVALID_UUID, VALID_UUID])).toThrow(
      `SDK Error: Invalid product ID(s): ${INVALID_UUID}`,
    );
  });
});

// ===========================================================================
// 3. setCategories
// ===========================================================================

describe('setCategories', () => {
  it('should throw when no categories are provided', () => {
    expect(() => mca.setCategories(undefined as any)).toThrow(
      'SDK Error: Please provide a category',
    );
  });

  it('should throw when an empty array is provided', () => {
    expect(() => mca.setCategories([])).toThrow(
      'SDK Error: Please provide a category',
    );
  });

  it('should return the instance (fluent interface) when valid categories are provided', () => {
    const result = mca.setCategories([PRODUCT_CATEGORIES.Auto]);
    expect(result).toBe(mca);
  });

  it('should accept multiple valid categories', () => {
    expect(() =>
      mca.setCategories([PRODUCT_CATEGORIES.Auto, PRODUCT_CATEGORIES.Health]),
    ).not.toThrow();
  });

  it('should throw an error listing invalid categories when any is invalid', () => {
    expect(() => mca.setCategories(['not-a-valid-category' as any])).toThrow(
      'SDK Error: Invalid category(ies): not-a-valid-category',
    );
  });
});

// ===========================================================================
// 4. fetchProducts
// ===========================================================================

describe('fetchProducts', () => {
  it('should return a success response with products array', async () => {
    const fakeProducts = [{ id: VALID_UUID, name: 'Test Product' }];
    mockGet.mockResolvedValue({
      data: { products: fakeProducts, total_count: 1 },
    });

    const res = await mca.fetchProducts({ page: 1, limit: 10 });

    expect(res.code).toBe(1);
    expect(res.message).toBe('Products fetched successfully');
    expect(res.data).toEqual(fakeProducts);
    expect(res.meta).toMatchObject({ page: 1, limit: 10, totalCount: 1 });
  });

  it('should use default page=1 and limit=10 when not specified', async () => {
    mockGet.mockResolvedValue({ data: { products: [], total_count: 0 } });

    await mca.fetchProducts({});

    expect(mockGet).toHaveBeenCalledTimes(1);
    const [, options] = mockGet.mock.calls[0];
    expect(options.params.page).toBe(1);
    expect(options.params.limit).toBe(10);
  });

  it('should return a failure response when the API call fails', async () => {
    mockGet.mockRejectedValue(new Error('API down'));

    const res = await mca.fetchProducts({ page: 1, limit: 10 });

    expect(res.code).toBe(0);
    expect(res.message).toBe('API down');
  });

  it('should pass totalCount as 0 when total_count is missing', async () => {
    mockGet.mockResolvedValue({ data: { products: [] } });

    const res = await mca.fetchProducts({ page: 1, limit: 5 });

    expect(res.meta?.totalCount).toBe(0);
  });
});

// ===========================================================================
// 5. fetchOneProduct
// ===========================================================================

describe('fetchOneProduct', () => {
  it('should return a failure response for missing product ID', async () => {
    const res = await mca.fetchOneProduct(undefined as any);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: product id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchOneProduct(INVALID_UUID);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid product id');
  });

  it('should return a success response and strip internal fields', async () => {
    const rawData = {
      id: VALID_UUID,
      name: 'Device Cover',
      sharing_formula: 'secret',
      set_by: 'admin',
      utilities: [],
      payment_providers: [],
      utility_batches: [],
      dependency: null,
      meta: {},
      document_url: 'http://example.com',
    };
    mockGet.mockResolvedValue({ data: { ...rawData } });

    const res = await mca.fetchOneProduct(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Product fetched successfully');
    expect(res.data).not.toHaveProperty('sharing_formula');
    expect(res.data).not.toHaveProperty('set_by');
    expect(res.data).not.toHaveProperty('utilities');
    expect(res.data).not.toHaveProperty('payment_providers');
    expect(res.data).not.toHaveProperty('utility_batches');
    expect(res.data).not.toHaveProperty('dependency');
    expect(res.data).not.toHaveProperty('meta');
    expect(res.data).not.toHaveProperty('document_url');
    expect(res.data.id).toBe(VALID_UUID);
    expect(res.data.name).toBe('Device Cover');
  });
});

// ===========================================================================
// 6. fetchOneUtility
// ===========================================================================

describe('fetchOneUtility', () => {
  it('should return a failure response for missing utility ID', async () => {
    const res = await mca.fetchOneUtility(undefined as any);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: utility id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchOneUtility(INVALID_UUID);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid utility id');
  });

  it('should return a success response with utility data', async () => {
    const fakeUtility = { id: VALID_UUID, name: 'Some Utility' };
    mockGet.mockResolvedValue({ data: fakeUtility });

    const res = await mca.fetchOneUtility(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Utility fetched successfully');
    expect(res.data).toEqual(fakeUtility);
  });
});

// ===========================================================================
// 7. calculatePremium
// ===========================================================================

describe('calculatePremium', () => {
  it('should return a failure response for missing product ID', async () => {
    const res = await mca.calculatePremium(undefined as any, {});
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: product id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.calculatePremium(INVALID_UUID, {});
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid product id');
  });

  it('should return a success response with premium data', async () => {
    const fakePremium = { premium: 5000, currency: 'NGN' };
    mockPost.mockResolvedValue({ data: fakePremium });

    const form = { cover_value: 100000 };
    const res = await mca.calculatePremium(VALID_UUID, form);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Premium calculated successfully');
    expect(res.data).toEqual(fakePremium);
  });

  it('should post correct payload structure', async () => {
    mockPost.mockResolvedValue({ data: {} });
    const form = { age: 30 };

    await mca.calculatePremium(VALID_UUID, form);

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        product_id: VALID_UUID,
        body: form,
      }),
    );
  });
});

// ===========================================================================
// 8. buy
// ===========================================================================

describe('buy', () => {
  const buyForm = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    date_of_birth: '1990-01-01',
    phone_number: '+2348012345678',
    gender: 'Male' as const,
    address: '1 Test Street',
    bought_for_self: true,
  };

  it('should return a failure response for missing product ID', async () => {
    const res = await mca.buy(undefined as any, buyForm);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: product id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.buy(INVALID_UUID, buyForm);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid product id');
  });

  it('should return a success response after purchasing a policy', async () => {
    const fakePolicy = { policy_id: VALID_UUID, status: 'active' };
    mockPost.mockResolvedValue({ data: fakePolicy });

    const res = await mca.buy(VALID_UUID, buyForm);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Policy purchased successfully');
    expect(res.data).toEqual(fakePolicy);
  });

  it('should spread the form fields and attach product_id to the payload', async () => {
    mockPost.mockResolvedValue({ data: {} });

    await mca.buy(VALID_UUID, buyForm);

    expect(mockPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ ...buyForm, product_id: VALID_UUID }),
    );
  });
});

// ===========================================================================
// 9. renew
// ===========================================================================

describe('renew', () => {
  it('should return a failure response for missing policy ID', async () => {
    const res = await mca.renew(undefined as any, {});
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: policy id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.renew(INVALID_UUID, {});
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid policy id');
  });

  it('should return a success response after renewing a policy', async () => {
    const fakeRenewal = { renewal_id: VALID_UUID };
    mockPost.mockResolvedValue({ data: fakeRenewal });

    const res = await mca.renew(VALID_UUID, { extra_field: 'value' });

    expect(res.code).toBe(1);
    expect(res.message).toBe('Policy renewed successfully');
    expect(res.data).toEqual(fakeRenewal);
  });
});

// ===========================================================================
// 10. fetchPolicies
// ===========================================================================

describe('fetchPolicies', () => {
  it('should return a success response with policies array', async () => {
    const fakePolicies = [{ id: VALID_UUID }];
    mockGet.mockResolvedValue({
      data: { policies: fakePolicies, total_result: 1 },
    });

    const res = await mca.fetchPolicies({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Policies fetched successfully');
    expect(res.data).toEqual(fakePolicies);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should return a failure response when productId is provided but invalid', async () => {
    const res = await mca.fetchPolicies({ productId: INVALID_UUID });
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid product id');
  });

  it('should return a failure response when activatedAtStart is an invalid date', async () => {
    const res = await mca.fetchPolicies({ activatedAtStart: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should return a failure response when activatedAtEnd is an invalid date', async () => {
    const res = await mca.fetchPolicies({ activatedAtEnd: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should return a failure response when expiredAtStart is an invalid date', async () => {
    const res = await mca.fetchPolicies({ expiredAtStart: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should return a failure response when expiredAtEnd is an invalid date', async () => {
    const res = await mca.fetchPolicies({ expiredAtEnd: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { policies: [], total_result: 0 } });

    const res = await mca.fetchPolicies({
      page: 2,
      limit: 5,
      search: 'john',
      isActive: true,
      productId: VALID_UUID,
      activatedAtStart: VALID_DATE,
      activatedAtEnd: VALID_DATE,
      expiredAtStart: VALID_DATE,
      expiredAtEnd: VALID_DATE,
    });

    expect(res.code).toBe(1);
  });
});

// ===========================================================================
// 11. fetchOnePolicy
// ===========================================================================

describe('fetchOnePolicy', () => {
  it('should return a failure response for missing policy ID', async () => {
    const res = await mca.fetchOnePolicy(undefined as any);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: policy id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchOnePolicy(INVALID_UUID);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid policy id');
  });

  it('should return a success response and strip internal fields', async () => {
    const rawData = {
      id: VALID_UUID,
      status: 'active',
      mca_payload: 'secret',
      as_service_meta: 'secret',
      history: [],
    };
    mockGet.mockResolvedValue({ data: { ...rawData } });

    const res = await mca.fetchOnePolicy(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Policy fetched successfully');
    expect(res.data).not.toHaveProperty('mca_payload');
    expect(res.data).not.toHaveProperty('as_service_meta');
    expect(res.data).not.toHaveProperty('history');
    expect(res.data.id).toBe(VALID_UUID);
  });
});

// ===========================================================================
// 12. fetchClaims
// ===========================================================================

describe('fetchClaims', () => {
  it('should return a success response with claims array', async () => {
    const fakeClaims = [{ id: VALID_UUID }];
    mockGet.mockResolvedValue({
      data: { claims: fakeClaims, total_result: 1 },
    });

    const res = await mca.fetchClaims({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Claims fetched successfully');
    expect(res.data).toEqual(fakeClaims);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should return a failure response when customerId is provided but invalid', async () => {
    const res = await mca.fetchClaims({ customerId: INVALID_UUID });
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid customer id');
  });

  it('should return a failure response when startDate is an invalid date', async () => {
    const res = await mca.fetchClaims({ startDate: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should return a failure response when endDate is an invalid date', async () => {
    const res = await mca.fetchClaims({ endDate: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { claims: [], total_result: 0 } });

    const res = await mca.fetchClaims({
      page: 1,
      limit: 10,
      status: 'pending',
      type: 'medical',
      customerId: VALID_UUID,
      startDate: VALID_DATE,
      endDate: VALID_DATE,
      search: 'claim',
    });

    expect(res.code).toBe(1);
  });
});

// ===========================================================================
// 13. fetchOneClaim
// ===========================================================================

describe('fetchOneClaim', () => {
  it('should return a failure response for missing claim ID', async () => {
    const res = await mca.fetchOneClaim(undefined as any);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: claim id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchOneClaim(INVALID_UUID);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid claim id');
  });

  it('should return a success response and strip internal fields', async () => {
    const rawData = {
      id: VALID_UUID,
      status: 'approved',
      mca_payload: 'secret',
      as_service_meta: 'secret',
      history: [],
    };
    mockGet.mockResolvedValue({ data: { ...rawData } });

    const res = await mca.fetchOneClaim(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Claim fetched successfully');
    expect(res.data).not.toHaveProperty('mca_payload');
    expect(res.data).not.toHaveProperty('as_service_meta');
    expect(res.data).not.toHaveProperty('history');
    expect(res.data.id).toBe(VALID_UUID);
  });
});

// ===========================================================================
// 14. fetchCustomers
// ===========================================================================

describe('fetchCustomers', () => {
  it('should return a success response with customers array', async () => {
    const fakeCustomers = [{ id: VALID_UUID }];
    mockGet.mockResolvedValue({
      data: { customers: fakeCustomers, total_result: 1 },
    });

    const res = await mca.fetchCustomers({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customers fetched successfully');
    expect(res.data).toEqual(fakeCustomers);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should return a failure response when createdAtStart is an invalid date', async () => {
    const res = await mca.fetchCustomers({ createdAtStart: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should return a failure response when createdAtEnd is an invalid date', async () => {
    const res = await mca.fetchCustomers({ createdAtEnd: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { customers: [], total_result: 0 } });

    const res = await mca.fetchCustomers({
      page: 1,
      limit: 20,
      isActive: false,
      createdAtStart: VALID_DATE,
      createdAtEnd: VALID_DATE,
      search: 'jane',
    });

    expect(res.code).toBe(1);
  });
});

// ===========================================================================
// 15. fetchOneCustomer
// ===========================================================================

describe('fetchOneCustomer', () => {
  it('should return a failure response for missing customer ID', async () => {
    const res = await mca.fetchOneCustomer(undefined as any);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: customer id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchOneCustomer(INVALID_UUID);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid customer id');
  });

  it('should return a success response with customer data', async () => {
    const fakeCustomer = { id: VALID_UUID, email: 'john@example.com' };
    mockGet.mockResolvedValue({ data: fakeCustomer });

    const res = await mca.fetchOneCustomer(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customer fetched successfully');
    expect(res.data).toEqual(fakeCustomer);
  });
});

// ===========================================================================
// 16. fetchCustomerPurchases
// ===========================================================================

describe('fetchCustomerPurchases', () => {
  it('should return a failure response for missing customer ID', async () => {
    const res = await mca.fetchCustomerPurchases({
      customerId: undefined as any,
    });
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: customer id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchCustomerPurchases({ customerId: INVALID_UUID });
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid customer id');
  });

  it('should return a success response with purchases array', async () => {
    const fakePurchases = [{ id: VALID_UUID_2 }];
    mockGet.mockResolvedValue({
      data: { purchases: fakePurchases, total_result: 1 },
    });

    const res = await mca.fetchCustomerPurchases({
      customerId: VALID_UUID,
    });

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customer purchases fetched successfully');
    expect(res.data).toEqual(fakePurchases);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should pass the isRenewal filter in the request params', async () => {
    mockGet.mockResolvedValue({ data: { purchases: [], total_result: 0 } });

    await mca.fetchCustomerPurchases({
      customerId: VALID_UUID,
      isRenewal: true,
    });

    const [, options] = mockGet.mock.calls[0];
    expect(options.params.is_renewal).toBe(true);
  });
});

// ===========================================================================
// 17. fetchCustomerPolicies
// ===========================================================================

describe('fetchCustomerPolicies', () => {
  it('should return a failure response for missing customer ID', async () => {
    const res = await mca.fetchCustomerPolicies({
      customerId: undefined as any,
    });
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: customer id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchCustomerPolicies({ customerId: INVALID_UUID });
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid customer id');
  });

  it('should return a success response with policies array', async () => {
    const fakePolicies = [{ id: VALID_UUID_2 }];
    mockGet.mockResolvedValue({
      data: { policies: fakePolicies, total_result: 1 },
    });

    const res = await mca.fetchCustomerPolicies({
      customerId: VALID_UUID,
    });

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customer policies fetched successfully');
    expect(res.data).toEqual(fakePolicies);
    expect(res.meta?.totalCount).toBe(1);
  });
});

// ===========================================================================
// 18. fetchPurchases
// ===========================================================================

describe('fetchPurchases', () => {
  it('should return a success response with purchases array', async () => {
    const fakePurchases = [{ id: VALID_UUID }];
    mockGet.mockResolvedValue({
      data: { purchases: fakePurchases, total_result: 2 },
    });

    const res = await mca.fetchPurchases({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Purchases fetched successfully');
    expect(res.data).toEqual(fakePurchases);
    expect(res.meta?.totalCount).toBe(2);
  });

  it('should return a failure response when createdAtStart is an invalid date', async () => {
    const res = await mca.fetchPurchases({ createdAtStart: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should return a failure response when createdAtEnd is an invalid date', async () => {
    const res = await mca.fetchPurchases({ createdAtEnd: INVALID_DATE });
    expect(res.code).toBe(0);
    expect(res.message).toBe(
      'SDK Error: Invalid date: 15-01-2024. Must be in yyyy-mm-dd format',
    );
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { purchases: [], total_result: 0 } });

    const res = await mca.fetchPurchases({
      page: 3,
      limit: 15,
      search: 'motor',
      isRenewal: false,
      createdAtStart: VALID_DATE,
      createdAtEnd: VALID_DATE,
    });

    expect(res.code).toBe(1);
  });
});

// ===========================================================================
// 19. fetchOnePurchase
// ===========================================================================

describe('fetchOnePurchase', () => {
  it('should return a failure response for missing purchase ID', async () => {
    const res = await mca.fetchOnePurchase(undefined as any);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: purchase id is required');
  });

  it('should return a failure response for an invalid UUID', async () => {
    const res = await mca.fetchOnePurchase(INVALID_UUID);
    expect(res.code).toBe(0);
    expect(res.message).toBe('SDK Error: Invalid purchase id');
  });

  it('should return a success response and strip internal fields', async () => {
    const rawData = {
      id: VALID_UUID,
      amount: 15000,
      dividend: 'internal',
      renewal_history: [],
    };
    mockGet.mockResolvedValue({ data: { ...rawData } });

    const res = await mca.fetchOnePurchase(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Purchase fetched successfully');
    expect(res.data).not.toHaveProperty('dividend');
    expect(res.data).not.toHaveProperty('renewal_history');
    expect(res.data.id).toBe(VALID_UUID);
    expect(res.data.amount).toBe(15000);
  });
});
