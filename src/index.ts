import {
  ENDPOINTS,
  PRODUCT_CATEGORIES,
  PRODUCTS_RECOMMENDED,
} from './shared/constant';
import { isValidUUID } from './utils/validators';
import { FetchClient, FetchError } from './utils/client';
import { IRequiredBuyForm, IMcaResponse } from './shared/interface';

class MyCoverAi {
  constructor() {}

  // props
  private static baseURL = 'https://v2.api.mycover.ai/v2';
  private static apiKey: string;
  private static selectedProducts: string[] = [];
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

    MyCoverAi.selectedProducts = validProductIds;

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

  static async fetchProducts(page = 1, limit = 10) {
    const params = {
      page,
      limit,
      product_id: MyCoverAi.selectedProducts,
      category_id: MyCoverAi.selectedCategories,
    };

    let products: any[] = [];

    try {
      const { data } = await MyCoverAi.client.get(ENDPOINTS.getAllProducts, {
        params,
      });

      products = data?.products;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Products fetched successfully',
      products,
    );
  }

  static async fetchProduct(productId: string) {
    MyCoverAi.validateProductId(productId);

    let product: any = {};

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

  static async fetchUtility(utilityId: string) {
    if (!isValidUUID(utilityId)) {
      MyCoverAi.throwError('Invalid utility ID');
    }

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

  static async calculatePremium<T>(productId: string, form: T) {
    MyCoverAi.validateProductId(productId);

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

  static async buy(productId: string, form: IRequiredBuyForm) {
    MyCoverAi.validateProductId(productId);

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

  private static handleSuccessResponse(
    message: string,
    data: any,
  ): IMcaResponse {
    return {
      code: 1,
      message,
      data,
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

  private static validateProductId(productId: string) {
    if (!isValidUUID(productId)) {
      MyCoverAi.throwError('Invalid product ID');
    }
  }
}

export { IRequiredBuyForm, PRODUCTS_RECOMMENDED, PRODUCT_CATEGORIES };
export default MyCoverAi;
