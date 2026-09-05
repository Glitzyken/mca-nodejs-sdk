import {
  ENDPOINTS,
  PRODUCT_CATEGORIES,
  PRODUCTS_RECOMMENDED,
} from './shared/constant';
import { isValidDate, isValidUUID } from './utils/validators';
import { FetchClient, FetchError } from './utils/client';
import { IBuyForm, IMcaResponse } from './shared/interface';

class MyCoverAi {
  // private baseURL = 'https://v2.api.mycover.ai/v2';
  private baseURL = 'https://dev.v2.api.mycover.ai/v2';
  private apiKey: string;
  private myProducts: string[] = [];
  private selectedCategories: string[] = [];
  private client: FetchClient;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('SDK Error: API Key is required');
    }

    this.apiKey = apiKey;
    this.client = new FetchClient({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });
  }

  /**
   * Sets the specific product IDs to filter subsequent product fetches.
   *
   * @param productIds - Array of product UUIDs.
   * @returns The current MyCoverAi instance for builder chaining.
   * @throws {Error} If productIds is empty or contains invalid UUIDs.
   */
  setProducts(productIds: string[]) {
    if (!productIds?.length) {
      this.throwError('Please provide at least one product ID');
    }

    const invalidIds: string[] = [];
    const validProductIds: string[] = [];

    for (const id of productIds) {
      if (isValidUUID(id)) {
        validProductIds.push(id);
      } else {
        invalidIds.push(id);
      }
    }

    if (invalidIds.length > 0) {
      this.throwError(`Invalid product ID(s): ${invalidIds.join(', ')}`);
    }

    this.myProducts = validProductIds;

    return this;
  }

  /**
   * Sets the specific categories to filter subsequent product fetches.
   *
   * @param categories - Array of category IDs or keys.
   * @returns The current MyCoverAi instance for builder chaining.
   * @throws {Error} If categories is empty or contains invalid categories.
   */
  setCategories(
    categories: (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES][],
  ) {
    if (!categories?.length) {
      this.throwError('Please provide a category');
    }

    const invalidCategories: string[] = [];
    const validCategories: string[] = [];

    for (const category of categories) {
      if (Object.values(PRODUCT_CATEGORIES).includes(category)) {
        validCategories.push(category);
      } else {
        invalidCategories.push(category);
      }
    }

    if (invalidCategories.length > 0) {
      this.throwError(`Invalid category(ies): ${invalidCategories.join(', ')}`);
    }

    this.selectedCategories = validCategories;

    return this;
  }

  /**
   * Calculates the premium cost for a given product and form inputs.
   *
   * @param productId - The UUID of the product.
   * @param form - Record representing input fields required for calculation.
   * @returns A promise resolving to the API response.
   */
  async calculatePremium(
    productId: string,
    form: Record<string, any>,
  ): Promise<IMcaResponse> {
    try {
      this.validateId(productId, 'product');

      const payload = {
        product_id: productId,
        body: { ...form },
      };

      const { data } = await this.client.post(ENDPOINTS.getPremium, payload);

      return this.handleSuccessResponse(
        'Premium calculated successfully',
        data,
      );
    } catch (error) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Purchases a policy for a specific product.
   *
   * @param productId - The UUID of the product.
   * @param form - The customer purchase details.
   * @returns A promise resolving to the purchase API response.
   */
  async buy<T extends IBuyForm>(
    productId: string,
    form: T,
  ): Promise<IMcaResponse> {
    try {
      this.validateId(productId, 'product');

      const payload = {
        ...form,
        product_id: productId,
      };

      const { data } = await this.client.post(ENDPOINTS.buyProduct, payload);

      return this.handleSuccessResponse('Policy purchased successfully', data);
    } catch (error) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Renews an existing policy by its ID.
   *
   * @param policyId - The UUID of the policy to renew.
   * @param payload - Additional renewal options/fields.
   * @returns A promise resolving to the renewal API response.
   */
  async renew(
    policyId: string,
    payload: Record<string, any>,
  ): Promise<IMcaResponse> {
    try {
      this.validateId(policyId, 'policy');

      const body = {
        ...payload,
      };

      const { data } = await this.client.post(
        ENDPOINTS.renewProduct.replace(':id', policyId),
        body,
      );

      return this.handleSuccessResponse('Policy renewed successfully', data);
    } catch (error) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches all products, paginated and optionally filtered by selected categories/products.
   *
   * @param options - Paging configuration parameters.
   * @returns A promise resolving to the list of products.
   */
  async fetchProducts({
    page = 1,
    limit = 10,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IMcaResponse> {
    try {
      const params = {
        page,
        limit,
        product_id: this.myProducts,
        category_id: this.selectedCategories,
      };

      const { data } = await this.client.get(ENDPOINTS.getAllProducts, {
        params,
      });

      const products = data?.products || [];
      const totalCount = data?.total_count || 0;

      return this.handleSuccessResponse(
        'Products fetched successfully',
        products,
        {
          page,
          limit,
          totalCount,
        },
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches a single product by its ID.
   *
   * @param productId - The UUID of the product.
   * @returns A promise resolving to the product details.
   */
  async fetchOneProduct(productId: string): Promise<IMcaResponse> {
    try {
      this.validateId(productId, 'product');

      const { data } = await this.client.get(
        ENDPOINTS.getOneProduct.replace(':id', productId),
      );

      const product = { ...data };
      if (product) {
        'sharing_formula' in product && delete product.sharing_formula;
        'set_by' in product && delete product.set_by;
        'utilities' in product && delete product.utilities;
        'payment_providers' in product && delete product.payment_providers;
        'utility_batches' in product && delete product.utility_batches;
        'dependency' in product && delete product.dependency;
        'meta' in product && delete product.meta;
        'document_url' in product && delete product.document_url;
      }

      return this.handleSuccessResponse(
        'Product fetched successfully',
        product,
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches details of a single product utility.
   *
   * @param utilityId - The UUID of the utility.
   * @returns A promise resolving to the utility details.
   */
  async fetchOneUtility(utilityId: string): Promise<IMcaResponse> {
    try {
      this.validateId(utilityId, 'utility');

      const { data } = await this.client.get(
        ENDPOINTS.getUtility.replace(':id', utilityId),
      );

      return this.handleSuccessResponse('Utility fetched successfully', data);
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches a paginated list of policies with optional search, date, and status filters.
   *
   * @param filters - Parameters to filter the list of policies.
   * @returns A promise resolving to the list of policies.
   */
  async fetchPolicies({
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
  }): Promise<IMcaResponse> {
    try {
      if (productId) this.validateId(productId, 'product');
      if (activatedAtStart) this.validateDate(activatedAtStart);
      if (activatedAtEnd) this.validateDate(activatedAtEnd);
      if (expiredAtStart) this.validateDate(expiredAtStart);
      if (expiredAtEnd) this.validateDate(expiredAtEnd);

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

      const { data } = await this.client.get(ENDPOINTS.getAllPolicies, {
        params,
      });

      const policies = data?.policies || [];
      const totalCount = data?.total_result || 0;

      return this.handleSuccessResponse(
        'Policies fetched successfully',
        policies,
        {
          page,
          limit,
          totalCount,
        },
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches details of a single policy.
   *
   * @param policyId - The UUID of the policy.
   * @returns A promise resolving to the policy details.
   */
  async fetchOnePolicy(policyId: string): Promise<IMcaResponse> {
    try {
      this.validateId(policyId, 'policy');

      const { data } = await this.client.get(
        ENDPOINTS.getOnePolicy.replace(':id', policyId),
      );

      const policy = { ...data };
      if (policy) {
        'mca_payload' in policy && delete policy.mca_payload;
        'as_service_meta' in policy && delete policy.as_service_meta;
        'history' in policy && delete policy.history;
      }

      return this.handleSuccessResponse('Policy fetched successfully', policy);
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches a paginated list of claims with optional filters.
   *
   * @param filters - Parameters to filter claims.
   * @returns A promise resolving to the list of claims.
   */
  async fetchClaims({
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
  }): Promise<IMcaResponse> {
    try {
      if (customerId) this.validateId(customerId, 'customer');
      if (startDate) this.validateDate(startDate);
      if (endDate) this.validateDate(endDate);

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

      const { data } = await this.client.get(ENDPOINTS.getAllClaims, {
        params,
      });

      const claims = data?.claims || [];
      const totalCount = data?.total_result || 0;

      return this.handleSuccessResponse('Claims fetched successfully', claims, {
        page,
        limit,
        totalCount,
      });
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches details of a single claim.
   *
   * @param claimId - The UUID of the claim.
   * @returns A promise resolving to the claim details.
   */
  async fetchOneClaim(claimId: string): Promise<IMcaResponse> {
    try {
      this.validateId(claimId, 'claim');

      const { data } = await this.client.get(
        ENDPOINTS.getOneClaim.replace(':id', claimId),
      );

      const claim = { ...data };
      if (claim) {
        'mca_payload' in claim && delete claim.mca_payload;
        'as_service_meta' in claim && delete claim.as_service_meta;
        'history' in claim && delete claim.history;
      }

      return this.handleSuccessResponse('Claim fetched successfully', claim);
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches a paginated list of customers.
   *
   * @param filters - Parameters to filter customers.
   * @returns A promise resolving to the list of customers.
   */
  async fetchCustomers({
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
  }): Promise<IMcaResponse> {
    try {
      if (createdAtStart) this.validateDate(createdAtStart);
      if (createdAtEnd) this.validateDate(createdAtEnd);

      const params = {
        page,
        limit,
        is_active: isActive,
        created_at_start: createdAtStart,
        created_at_end: createdAtEnd,
        search,
      };

      const { data } = await this.client.get(ENDPOINTS.getAllCustomers, {
        params,
      });

      const customers = data?.customers || [];
      const totalCount = data?.total_result || 0;

      return this.handleSuccessResponse(
        'Customers fetched successfully',
        customers,
        {
          page,
          limit,
          totalCount,
        },
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches details of a single customer.
   *
   * @param customerId - The UUID of the customer.
   * @returns A promise resolving to the customer details.
   */
  async fetchOneCustomer(customerId: string): Promise<IMcaResponse> {
    try {
      this.validateId(customerId, 'customer');

      const { data } = await this.client.get(
        ENDPOINTS.getOneCustomer.replace(':id', customerId),
      );

      return this.handleSuccessResponse('Customer fetched successfully', data);
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches purchases for a specific customer, paginated and filtered.
   *
   * @param options - Parameters including customerId, paging, and renewal flag.
   * @returns A promise resolving to the list of customer purchases.
   */
  async fetchCustomerPurchases({
    customerId,
    page = 1,
    limit = 10,
    isRenewal,
  }: {
    customerId: string;
    page?: number;
    limit?: number;
    isRenewal?: boolean;
  }): Promise<IMcaResponse> {
    try {
      this.validateId(customerId, 'customer');

      const params = {
        page,
        limit,
        is_renewal: isRenewal,
      };

      const { data } = await this.client.get(
        ENDPOINTS.getCustomerPurchases.replace(':id', customerId),
        {
          params,
        },
      );

      const purchases = data?.purchases || [];
      const totalCount = data?.total_result || 0;

      return this.handleSuccessResponse(
        'Customer purchases fetched successfully',
        purchases,
        {
          page,
          limit,
          totalCount,
        },
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches policies associated with a specific customer, paginated.
   *
   * @param options - Parameters including customerId and paging.
   * @returns A promise resolving to the list of customer policies.
   */
  async fetchCustomerPolicies({
    customerId,
    page = 1,
    limit = 10,
  }: {
    customerId: string;
    page?: number;
    limit?: number;
  }): Promise<IMcaResponse> {
    try {
      this.validateId(customerId, 'customer');

      const params = {
        page,
        limit,
      };

      const { data } = await this.client.get(
        ENDPOINTS.getCustomerPolicies.replace(':id', customerId),
        {
          params,
        },
      );

      const policies = data?.policies || [];
      const totalCount = data?.total_result || 0;

      return this.handleSuccessResponse(
        'Customer policies fetched successfully',
        policies,
        {
          page,
          limit,
          totalCount,
        },
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches a paginated list of all purchases.
   *
   * @param filters - Parameters to filter purchases.
   * @returns A promise resolving to the list of purchases.
   */
  async fetchPurchases({
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
  }): Promise<IMcaResponse> {
    try {
      if (createdAtStart) this.validateDate(createdAtStart);
      if (createdAtEnd) this.validateDate(createdAtEnd);

      const params = {
        page,
        limit,
        search,
        is_renewal: isRenewal,
        created_at_start: createdAtStart,
        created_at_end: createdAtEnd,
      };

      const { data } = await this.client.get(ENDPOINTS.getAllPurchases, {
        params,
      });

      const purchases = data?.purchases || [];
      const totalCount = data?.total_result || 0;

      return this.handleSuccessResponse(
        'Purchases fetched successfully',
        purchases,
        {
          page,
          limit,
          totalCount,
        },
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  /**
   * Fetches details of a single purchase and sanitizes internal fields.
   *
   * @param purchaseId - The UUID of the purchase.
   * @returns A promise resolving to the purchase details.
   */
  async fetchOnePurchase(purchaseId: string): Promise<IMcaResponse> {
    try {
      this.validateId(purchaseId, 'purchase');

      const { data } = await this.client.get(
        ENDPOINTS.getOnePurchase.replace(':id', purchaseId),
      );

      const purchase = { ...data };
      if (purchase) {
        'dividend' in purchase && delete purchase.dividend;
        'renewal_history' in purchase && delete purchase.renewal_history;
      }

      return this.handleSuccessResponse(
        'Purchase fetched successfully',
        purchase,
      );
    } catch (error: any) {
      return this.handleFailResponse(error);
    }
  }

  private handleSuccessResponse(
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

  private handleFailResponse(error: any): IMcaResponse {
    if (error instanceof FetchError) {
      return {
        code: 0,
        message: `API Error: ${error?.message}`,
      };
    }

    if (error instanceof Error) {
      return {
        code: 0,
        message: error.message,
      };
    }

    return {
      code: 0,
      message:
        typeof error === 'string' ? error : 'An unexpected error occurred',
    };
  }

  private throwError(message: string): never {
    throw new Error(`SDK Error: ${message}`);
  }

  private validateId(id: string, name: string) {
    if (!id) {
      this.throwError(`${name} id is required`);
    }

    if (!isValidUUID(id)) {
      this.throwError(`Invalid ${name} id`);
    }
  }

  private validateDate(date: string) {
    if (!isValidDate(date)) {
      this.throwError(`Invalid date: ${date}. Must be in yyyy-mm-dd format`);
    }
  }
}

export type { IBuyForm, IMcaResponse };
export { PRODUCTS_RECOMMENDED, PRODUCT_CATEGORIES };
export default MyCoverAi;
