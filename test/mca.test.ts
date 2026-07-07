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

let mockGet: jest.SpyInstance;
let mockPost: jest.SpyInstance;

// ---------------------------------------------------------------------------
// Global setup
// ---------------------------------------------------------------------------

beforeAll(() => {
  MyCoverAi.setApiKey(TEST_API_KEY);
});

beforeEach(() => {
  mockGet = jest.spyOn(FetchClient.prototype, 'get');
  mockPost = jest.spyOn(FetchClient.prototype, 'post');
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ===========================================================================
// 1. setApiKey
// ===========================================================================

describe('setApiKey', () => {
  it('should throw SDK Error when no key is provided', () => {
    expect(() => MyCoverAi.setApiKey(undefined as any)).toThrow(
      'SDK Error: API Key is required',
    );
  });

  it('should throw SDK Error when an empty string is provided', () => {
    expect(() => MyCoverAi.setApiKey('')).toThrow(
      'SDK Error: API Key is required',
    );
  });

  it('should return the class (fluent interface) when a valid key is provided', () => {
    const result = MyCoverAi.setApiKey(TEST_API_KEY);
    expect(result).toBe(MyCoverAi);
  });
});

// ===========================================================================
// 2. setProducts
// ===========================================================================

describe('setProducts', () => {
  it('should throw when no product IDs are provided', () => {
    expect(() => MyCoverAi.setProducts(undefined as any)).toThrow(
      'SDK Error: Please provide at least one product ID',
    );
  });

  it('should throw when an empty array is provided', () => {
    expect(() => MyCoverAi.setProducts([])).toThrow(
      'SDK Error: Please provide at least one product ID',
    );
  });

  it('should return the class (fluent interface) when valid UUIDs are provided', () => {
    const result = MyCoverAi.setProducts([VALID_UUID]);
    expect(result).toBe(MyCoverAi);
  });

  it('should silently filter out invalid UUIDs, keeping only valid ones', () => {
    // Should NOT throw – invalid IDs are just ignored
    expect(() =>
      MyCoverAi.setProducts([INVALID_UUID, VALID_UUID]),
    ).not.toThrow();
  });
});

// ===========================================================================
// 3. setCategory
// ===========================================================================

describe('setCategory', () => {
  it('should throw when no categories are provided', () => {
    expect(() => MyCoverAi.setCategory(undefined as any)).toThrow(
      'SDK Error: Please provide a category',
    );
  });

  it('should throw when an empty array is provided', () => {
    expect(() => MyCoverAi.setCategory([])).toThrow(
      'SDK Error: Please provide a category',
    );
  });

  it('should return the class (fluent interface) when valid categories are provided', () => {
    const result = MyCoverAi.setCategory([PRODUCT_CATEGORIES.Auto]);
    expect(result).toBe(MyCoverAi);
  });

  it('should accept multiple valid categories', () => {
    expect(() =>
      MyCoverAi.setCategory([
        PRODUCT_CATEGORIES.Auto,
        PRODUCT_CATEGORIES.Health,
      ]),
    ).not.toThrow();
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

    const res = await MyCoverAi.fetchProducts({ page: 1, limit: 10 });

    expect(res.code).toBe(1);
    expect(res.message).toBe('Products fetched successfully');
    expect(res.data).toEqual(fakeProducts);
    expect(res.meta).toMatchObject({ page: 1, limit: 10, totalCount: 1 });
  });

  it('should use default page=1 and limit=10 when not specified', async () => {
    mockGet.mockResolvedValue({ data: { products: [], total_count: 0 } });

    await MyCoverAi.fetchProducts({});

    expect(mockGet).toHaveBeenCalledTimes(1);
    const [, options] = mockGet.mock.calls[0];
    expect(options.params.page).toBe(1);
    expect(options.params.limit).toBe(10);
  });

  it('should return a failure response when the API call fails', async () => {
    mockGet.mockRejectedValue(new Error('API down'));

    const res = await MyCoverAi.fetchProducts({ page: 1, limit: 10 });

    // handleFailResponse passes non-FetchError objects through as-is
    expect(res).toBeInstanceOf(Error);
  });

  it('should pass totalCount as 0 when total_count is missing', async () => {
    mockGet.mockResolvedValue({ data: { products: [] } });

    const res = await MyCoverAi.fetchProducts({ page: 1, limit: 5 });

    expect(res.meta?.totalCount).toBe(0);
  });
});

// ===========================================================================
// 5. fetchOneProduct
// ===========================================================================

describe('fetchOneProduct', () => {
  it('should throw SDK Error for missing product ID', async () => {
    await expect(MyCoverAi.fetchOneProduct(undefined as any)).rejects.toThrow(
      'SDK Error: product id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.fetchOneProduct(INVALID_UUID)).rejects.toThrow(
      'SDK Error: Invalid product id',
    );
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

    const res = await MyCoverAi.fetchOneProduct(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Product fetched successfully');
    // Internal fields should have been removed
    expect(res.data).not.toHaveProperty('sharing_formula');
    expect(res.data).not.toHaveProperty('set_by');
    expect(res.data).not.toHaveProperty('utilities');
    expect(res.data).not.toHaveProperty('payment_providers');
    expect(res.data).not.toHaveProperty('utility_batches');
    expect(res.data).not.toHaveProperty('dependency');
    expect(res.data).not.toHaveProperty('meta');
    expect(res.data).not.toHaveProperty('document_url');
    // Public fields should remain
    expect(res.data.id).toBe(VALID_UUID);
    expect(res.data.name).toBe('Device Cover');
  });
});

// ===========================================================================
// 6. fetchOneUtility
// ===========================================================================

describe('fetchOneUtility', () => {
  it('should throw SDK Error for missing utility ID', async () => {
    await expect(MyCoverAi.fetchOneUtility(undefined as any)).rejects.toThrow(
      'SDK Error: utility id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.fetchOneUtility(INVALID_UUID)).rejects.toThrow(
      'SDK Error: Invalid utility id',
    );
  });

  it('should return a success response with utility data', async () => {
    const fakeUtility = { id: VALID_UUID, name: 'Some Utility' };
    mockGet.mockResolvedValue({ data: fakeUtility });

    const res = await MyCoverAi.fetchOneUtility(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Utility fetched successfully');
    expect(res.data).toEqual(fakeUtility);
  });
});

// ===========================================================================
// 7. calculatePremium
// ===========================================================================

describe('calculatePremium', () => {
  it('should throw SDK Error for missing product ID', async () => {
    await expect(
      MyCoverAi.calculatePremium(undefined as any, {}),
    ).rejects.toThrow('SDK Error: product id is required');
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.calculatePremium(INVALID_UUID, {})).rejects.toThrow(
      'SDK Error: Invalid product id',
    );
  });

  it('should return a success response with premium data', async () => {
    const fakePremium = { premium: 5000, currency: 'NGN' };
    mockPost.mockResolvedValue({ data: fakePremium });

    const form = { cover_value: 100000 };
    const res = await MyCoverAi.calculatePremium(VALID_UUID, form);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Premium calculated successfully');
    expect(res.data).toEqual(fakePremium);
  });

  it('should post correct payload structure', async () => {
    mockPost.mockResolvedValue({ data: {} });
    const form = { age: 30 };

    await MyCoverAi.calculatePremium(VALID_UUID, form);

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

  it('should throw SDK Error for missing product ID', async () => {
    await expect(MyCoverAi.buy(undefined as any, buyForm)).rejects.toThrow(
      'SDK Error: product id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.buy(INVALID_UUID, buyForm)).rejects.toThrow(
      'SDK Error: Invalid product id',
    );
  });

  it('should return a success response after purchasing a policy', async () => {
    const fakePolicy = { policy_id: VALID_UUID, status: 'active' };
    mockPost.mockResolvedValue({ data: fakePolicy });

    const res = await MyCoverAi.buy(VALID_UUID, buyForm);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Policy purchased successfully');
    expect(res.data).toEqual(fakePolicy);
  });

  it('should spread the form fields and attach product_id to the payload', async () => {
    mockPost.mockResolvedValue({ data: {} });

    await MyCoverAi.buy(VALID_UUID, buyForm);

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
  it('should throw SDK Error for missing policy ID', async () => {
    await expect(MyCoverAi.renew(undefined as any, {})).rejects.toThrow(
      'SDK Error: policy id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.renew(INVALID_UUID, {})).rejects.toThrow(
      'SDK Error: Invalid policy id',
    );
  });

  it('should return a success response after renewing a policy', async () => {
    const fakeRenewal = { renewal_id: VALID_UUID };
    mockPost.mockResolvedValue({ data: fakeRenewal });

    const res = await MyCoverAi.renew(VALID_UUID, { extra_field: 'value' });

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

    const res = await MyCoverAi.fetchPolicies({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Policies fetched successfully');
    expect(res.data).toEqual(fakePolicies);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should throw SDK Error when productId is provided but invalid', async () => {
    await expect(
      MyCoverAi.fetchPolicies({ productId: INVALID_UUID }),
    ).rejects.toThrow('SDK Error: Invalid product id');
  });

  it('should throw SDK Error when activatedAtStart is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchPolicies({ activatedAtStart: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should throw SDK Error when activatedAtEnd is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchPolicies({ activatedAtEnd: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should throw SDK Error when expiredAtStart is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchPolicies({ expiredAtStart: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should throw SDK Error when expiredAtEnd is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchPolicies({ expiredAtEnd: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { policies: [], total_result: 0 } });

    const res = await MyCoverAi.fetchPolicies({
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
  it('should throw SDK Error for missing policy ID', async () => {
    await expect(MyCoverAi.fetchOnePolicy(undefined as any)).rejects.toThrow(
      'SDK Error: policy id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.fetchOnePolicy(INVALID_UUID)).rejects.toThrow(
      'SDK Error: Invalid policy id',
    );
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

    const res = await MyCoverAi.fetchOnePolicy(VALID_UUID);

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

    const res = await MyCoverAi.fetchClaims({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Claims fetched successfully');
    expect(res.data).toEqual(fakeClaims);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should throw SDK Error when customerId is provided but invalid', async () => {
    await expect(
      MyCoverAi.fetchClaims({ customerId: INVALID_UUID }),
    ).rejects.toThrow('SDK Error: Invalid customer id');
  });

  it('should throw SDK Error when startDate is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchClaims({ startDate: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should throw SDK Error when endDate is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchClaims({ endDate: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { claims: [], total_result: 0 } });

    const res = await MyCoverAi.fetchClaims({
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
  it('should throw SDK Error for missing claim ID', async () => {
    await expect(MyCoverAi.fetchOneClaim(undefined as any)).rejects.toThrow(
      'SDK Error: claim id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.fetchOneClaim(INVALID_UUID)).rejects.toThrow(
      'SDK Error: Invalid claim id',
    );
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

    const res = await MyCoverAi.fetchOneClaim(VALID_UUID);

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

    const res = await MyCoverAi.fetchCustomers({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customers fetched successfully');
    expect(res.data).toEqual(fakeCustomers);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should throw SDK Error when createdAtStart is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchCustomers({ createdAtStart: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should throw SDK Error when createdAtEnd is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchCustomers({ createdAtEnd: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { customers: [], total_result: 0 } });

    const res = await MyCoverAi.fetchCustomers({
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
  it('should throw SDK Error for missing customer ID', async () => {
    await expect(MyCoverAi.fetchOneCustomer(undefined as any)).rejects.toThrow(
      'SDK Error: customer id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.fetchOneCustomer(INVALID_UUID)).rejects.toThrow(
      'SDK Error: Invalid customer id',
    );
  });

  it('should return a success response with customer data', async () => {
    const fakeCustomer = { id: VALID_UUID, email: 'john@example.com' };
    mockGet.mockResolvedValue({ data: fakeCustomer });

    const res = await MyCoverAi.fetchOneCustomer(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customer fetched successfully');
    expect(res.data).toEqual(fakeCustomer);
  });
});

// ===========================================================================
// 16. fetchCustomerPurchases
// ===========================================================================

describe('fetchCustomerPurchases', () => {
  it('should throw SDK Error for missing customer ID', async () => {
    await expect(
      MyCoverAi.fetchCustomerPurchases({ customerId: undefined as any }),
    ).rejects.toThrow('SDK Error: customer id is required');
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(
      MyCoverAi.fetchCustomerPurchases({ customerId: INVALID_UUID }),
    ).rejects.toThrow('SDK Error: Invalid customer id');
  });

  it('should return a success response with purchases array', async () => {
    const fakePurchases = [{ id: VALID_UUID_2 }];
    mockGet.mockResolvedValue({
      data: { purchases: fakePurchases, total_result: 1 },
    });

    const res = await MyCoverAi.fetchCustomerPurchases({
      customerId: VALID_UUID,
    });

    expect(res.code).toBe(1);
    expect(res.message).toBe('Customer purchases fetched successfully');
    expect(res.data).toEqual(fakePurchases);
    expect(res.meta?.totalCount).toBe(1);
  });

  it('should pass the isRenewal filter in the request params', async () => {
    mockGet.mockResolvedValue({ data: { purchases: [], total_result: 0 } });

    await MyCoverAi.fetchCustomerPurchases({
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
  it('should throw SDK Error for missing customer ID', async () => {
    await expect(
      MyCoverAi.fetchCustomerPolicies({ customerId: undefined as any }),
    ).rejects.toThrow('SDK Error: customer id is required');
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(
      MyCoverAi.fetchCustomerPolicies({ customerId: INVALID_UUID }),
    ).rejects.toThrow('SDK Error: Invalid customer id');
  });

  it('should return a success response with policies array', async () => {
    const fakePolicies = [{ id: VALID_UUID_2 }];
    mockGet.mockResolvedValue({
      data: { policies: fakePolicies, total_result: 1 },
    });

    const res = await MyCoverAi.fetchCustomerPolicies({
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

    const res = await MyCoverAi.fetchPurchases({});

    expect(res.code).toBe(1);
    expect(res.message).toBe('Purchases fetched successfully');
    expect(res.data).toEqual(fakePurchases);
    expect(res.meta?.totalCount).toBe(2);
  });

  it('should throw SDK Error when createdAtStart is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchPurchases({ createdAtStart: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should throw SDK Error when createdAtEnd is an invalid date', async () => {
    await expect(
      MyCoverAi.fetchPurchases({ createdAtEnd: INVALID_DATE }),
    ).rejects.toThrow('SDK Error: Invalid date');
  });

  it('should accept all optional filters with valid values', async () => {
    mockGet.mockResolvedValue({ data: { purchases: [], total_result: 0 } });

    const res = await MyCoverAi.fetchPurchases({
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
  it('should throw SDK Error for missing purchase ID', async () => {
    await expect(MyCoverAi.fetchOnePurchase(undefined as any)).rejects.toThrow(
      'SDK Error: purchase id is required',
    );
  });

  it('should throw SDK Error for an invalid UUID', async () => {
    await expect(MyCoverAi.fetchOnePurchase(INVALID_UUID)).rejects.toThrow(
      'SDK Error: Invalid purchase id',
    );
  });

  it('should return a success response and strip internal fields', async () => {
    const rawData = {
      id: VALID_UUID,
      amount: 15000,
      dividend: 'internal',
      renewal_history: [],
    };
    mockGet.mockResolvedValue({ data: { ...rawData } });

    const res = await MyCoverAi.fetchOnePurchase(VALID_UUID);

    expect(res.code).toBe(1);
    expect(res.message).toBe('Purchase fetched successfully');
    expect(res.data).not.toHaveProperty('dividend');
    expect(res.data).not.toHaveProperty('renewal_history');
    expect(res.data.id).toBe(VALID_UUID);
    expect(res.data.amount).toBe(15000);
  });
});
