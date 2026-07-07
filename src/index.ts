import {
  ENDPOINTS,
  PRODUCT_CATEGORIES,
  PRODUCTS_RECOMMENDED,
} from './shared/constant';
import { isValidDate, isValidUUID } from './utils/validators';
import { FetchClient, FetchError } from './utils/client';
import { IBuyForm, IMcaResponse } from './shared/interface';

class MyCoverAi {
  constructor() {}

  // props
  private static baseURL = 'https://v2.api.mycover.ai/v2';
  private static apiKey: string;
  private static myProducts: string[] = [];
  private static selectedCategories: string[] = [];
  private static client = new FetchClient({
    baseURL: MyCoverAi.baseURL,
  });

  static setApiKey(key: string) {
    if (!key) {
      MyCoverAi.throwError('API Key is required');
    }

    MyCoverAi.apiKey = key;

    const headers: Record<string, string> = {};

    headers['Authorization'] = `Bearer ${MyCoverAi.apiKey}`;

    MyCoverAi.client = new FetchClient({
      baseURL: MyCoverAi.baseURL,
      headers,
    });

    return this;
  }

  static setProducts(productIds: string[]) {
    if (!productIds?.length) {
      MyCoverAi.throwError('Please provide at least one product ID');
    }

    const validProductIds: string[] = [];

    for (const id of productIds) {
      if (isValidUUID(id)) {
        validProductIds.push(id);
      }
    }

    MyCoverAi.myProducts = validProductIds;

    return this;
  }

  static setCategory(
    categories: (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES][],
  ) {
    if (!categories?.length) {
      MyCoverAi.throwError('Please provide a category');
    }

    const validCategories: string[] = [];

    for (const category of categories) {
      if (Object.values(PRODUCT_CATEGORIES).includes(category)) {
        validCategories.push(category);
      }
    }

    MyCoverAi.selectedCategories = validCategories;

    return this;
  }

  static async calculatePremium(productId: string, form: Record<string, any>) {
    MyCoverAi.validateId(productId, 'product');

    const payload = {
      product_id: productId,
      body: { ...form },
    };

    try {
      const { data } = await MyCoverAi.client.post(
        ENDPOINTS.getPremium,
        payload,
      );

      return MyCoverAi.handleSuccessResponse(
        'Premium calculated successfully',
        data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async buy<T extends IBuyForm>(productId: string, form: T) {
    MyCoverAi.validateId(productId, 'product');

    const payload = {
      ...form,
      product_id: productId,
    };

    try {
      const { data } = await MyCoverAi.client.post(
        ENDPOINTS.buyProduct,
        payload,
      );

      return MyCoverAi.handleSuccessResponse(
        'Policy purchased successfully',
        data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async renewProduct(policyId: string) {
    // TODO
    return policyId;
  }

  static async fetchProducts({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }) {
    const params = {
      page,
      limit,
      product_id: MyCoverAi.myProducts,
      category_id: MyCoverAi.selectedCategories,
    };

    let products: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(ENDPOINTS.getAllProducts, {
        params,
      });

      products = data?.products;
      totalCount = data?.total_count || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Products fetched successfully',
      products,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchOneProduct(productId: string) {
    MyCoverAi.validateId(productId, 'product');

    let product: Record<string, any> = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getOneProduct.replace(':id', productId),
      );

      // remove extra fields
      if (data) {
        'sharing_formula' in data && delete data.sharing_formula;
        'set_by' in data && delete data.set_by;
        'utilities' in data && delete data.utilities;
        'payment_providers' in data && delete data.payment_providers;
        'utility_batches' in data && delete data.utility_batches;
        'dependency' in data && delete data.dependency;
        'meta' in data && delete data.meta;
        'document_url' in data && delete data.document_url;
      }

      product = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Product fetched successfully',
      product,
    );
  }

  static async fetchOneUtility(utilityId: string) {
    MyCoverAi.validateId(utilityId, 'utility');

    let utility: any = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getUtility.replace(':id', utilityId),
      );

      utility = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Utility fetched successfully',
      utility,
    );
  }

  static async fetchPolicies({
    page = 1,
    limit = 10,
    search,
    isActive,
    productId,
    activatedAtStart,
    activatedAtEnd,
    expiredAtStart,
    expiredAtEnd,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    productId?: string;
    activatedAtStart?: string;
    activatedAtEnd?: string;
    expiredAtStart?: string;
    expiredAtEnd?: string;
  }) {
    if (productId) MyCoverAi.validateId(productId, 'product');
    if (activatedAtStart) MyCoverAi.validateDate(activatedAtStart);
    if (activatedAtEnd) MyCoverAi.validateDate(activatedAtEnd);
    if (expiredAtStart) MyCoverAi.validateDate(expiredAtStart);
    if (expiredAtEnd) MyCoverAi.validateDate(expiredAtEnd);

    const params = {
      page,
      limit,
      search,
      is_active: isActive,
      product_id: productId,
      activated_at_start: activatedAtStart,
      activated_at_end: activatedAtEnd,
      expired_at_start: expiredAtStart,
      expired_at_end: expiredAtEnd,
    };

    let policies: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(ENDPOINTS.getAllPolicies, {
        params,
      });

      policies = data?.policies;
      totalCount = data?.total_result || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Policies fetched successfully',
      policies,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchOnePolicy(policyId: string) {
    MyCoverAi.validateId(policyId, 'policy');

    let policy: Record<string, any> = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getOnePolicy.replace(':id', policyId),
      );

      // remove extra fields
      if (data) {
        'mca_payload' in data && delete data.mca_payload;
        'as_service_meta' in data && delete data.as_service_meta;
        'history' in data && delete data.history;
      }

      policy = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Policy fetched successfully',
      policy,
    );
  }

  static async fetchClaims({
    page = 1,
    limit = 10,
    status,
    type,
    customerId,
    startDate,
    endDate,
    search,
  }: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) {
    if (customerId) MyCoverAi.validateId(customerId, 'customer');
    if (startDate) MyCoverAi.validateDate(startDate);
    if (endDate) MyCoverAi.validateDate(endDate);

    const params = {
      page,
      limit,
      status,
      type,
      customer_id: customerId,
      start_date: startDate,
      end_date: endDate,
      search,
    };

    let claims: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(ENDPOINTS.getAllClaims, {
        params,
      });

      claims = data?.claims;
      totalCount = data?.total_result || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Claims fetched successfully',
      claims,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchOneClaim(claimId: string) {
    MyCoverAi.validateId(claimId, 'claim');

    let claim: Record<string, any> = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getOneClaim.replace(':id', claimId),
      );

      // remove extra fields
      if (data) {
        'mca_payload' in data && delete data.mca_payload;
        'as_service_meta' in data && delete data.as_service_meta;
        'history' in data && delete data.history;
      }

      claim = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse('Claim fetched successfully', claim);
  }

  static async fetchCustomers({
    page = 1,
    limit = 10,
    isActive,
    createdAtStart,
    createdAtEnd,
    search,
  }: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    createdAtStart?: string;
    createdAtEnd?: string;
    search?: string;
  }) {
    if (createdAtStart) MyCoverAi.validateDate(createdAtStart);
    if (createdAtEnd) MyCoverAi.validateDate(createdAtEnd);

    const params = {
      page,
      limit,
      is_active: isActive,
      created_at_start: createdAtStart,
      created_at_end: createdAtEnd,
      search,
    };

    let customers: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(ENDPOINTS.getAllCustomers, {
        params,
      });

      customers = data?.customers;
      totalCount = data?.total_result || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Customers fetched successfully',
      customers,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchOneCustomer(customerId: string) {
    MyCoverAi.validateId(customerId, 'customer');

    let customer: Record<string, any> = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getOneCustomer.replace(':id', customerId),
      );

      customer = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Customer fetched successfully',
      customer,
    );
  }

  static async fetchCustomerPurchases({
    customerId,
    page = 1,
    limit = 10,
    isRenewal,
  }: {
    customerId: string;
    page?: number;
    limit?: number;
    isRenewal?: boolean;
  }) {
    MyCoverAi.validateId(customerId, 'customer');

    const params = {
      page,
      limit,
      is_renewal: isRenewal,
    };

    let purchases: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getCustomerPurchases.replace(':id', customerId),
        {
          params,
        },
      );

      purchases = data?.purchases;
      totalCount = data?.total_result || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Customer purchases fetched successfully',
      purchases,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchCustomerPolicies({
    customerId,
    page = 1,
    limit = 10,
  }: {
    customerId: string;
    page?: number;
    limit?: number;
  }) {
    MyCoverAi.validateId(customerId, 'customer');

    const params = {
      page,
      limit,
    };

    let policies: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getCustomerPolicies.replace(':id', customerId),
        {
          params,
        },
      );

      policies = data?.policies;
      totalCount = data?.total_result || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Customer policies fetched successfully',
      policies,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchPurchases({
    page = 1,
    limit = 10,
    search,
    isRenewal,
    createdAtStart,
    createdAtEnd,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    isRenewal?: boolean;
    createdAtStart?: string;
    createdAtEnd?: string;
  }) {
    if (createdAtStart) MyCoverAi.validateDate(createdAtStart);
    if (createdAtEnd) MyCoverAi.validateDate(createdAtEnd);

    const params = {
      page,
      limit,
      search,
      is_renewal: isRenewal,
      created_at_start: createdAtStart,
      created_at_end: createdAtEnd,
    };

    let purchases: any[] = [];
    let totalCount = 0;

    try {
      const { data } = await MyCoverAi.client.get(ENDPOINTS.getAllPurchases, {
        params,
      });

      purchases = data?.purchases;
      totalCount = data?.total_result || 0;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Purchases fetched successfully',
      purchases,
      {
        page,
        limit,
        totalCount,
      },
    );
  }

  static async fetchOnePurchase(purchaseId: string) {
    MyCoverAi.validateId(purchaseId, 'purchase');

    let purchase: Record<string, any> = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getOnePurchase.replace(':id', purchaseId),
      );

      // remove extra fields
      if (data) {
        'dividend' in data && delete data.dividend;
        'renewal_history' in data && delete data.renewal_history;
      }

      purchase = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Purchase fetched successfully',
      purchase,
    );
  }

  private static handleSuccessResponse(
    message: string,
    data: any,
    meta?: Record<string, any>,
  ): IMcaResponse {
    return {
      code: 1,
      message,
      data,
      ...(meta && { meta }),
    };
  }

  private static handleFailResponse(error: any): IMcaResponse {
    if (error instanceof FetchError) {
      return {
        code: 0,
        message: error?.message,
      };
    }

    return error;
  }

  private static throwError(message: string): never {
    throw new Error(message);
  }

  private static validateId(id: string, name: string) {
    if (!id) {
      MyCoverAi.throwError(`${name} id is required`);
    }

    if (!isValidUUID(id)) {
      MyCoverAi.throwError(`Invalid ${name} id`);
    }
  }

  private static validateDate(date: string) {
    if (!isValidDate(date)) {
      MyCoverAi.throwError(
        `Invalid date: ${date}. Must be in yyyy-mm-dd format`,
      );
    }
  }
}

export { IBuyForm, IMcaResponse, PRODUCTS_RECOMMENDED, PRODUCT_CATEGORIES };
export default MyCoverAi;
