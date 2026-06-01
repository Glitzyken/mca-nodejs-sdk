import { McaResponse } from './products/shared/types';
import {
  ENDPOINTS,
  PRODUCT_CATEGORIES,
  PRODUCTS_RECOMMENDED,
} from './products/shared/constant';
import activeProducts from './products';
import { isValidUUID } from './utils/validators';
import { FetchClient, FetchError } from './utils/client';

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

  static products = activeProducts;

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

  static async getProducts(page = 1, limit = 10) {
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
      200,
      products,
    );
  }

  static async getOneProduct(productId: string) {
    if (!isValidUUID(productId)) {
      MyCoverAi.throwError('Invalid product ID');
    }

    let product: any = {};

    try {
      const { data } = await MyCoverAi.client.get(
        ENDPOINTS.getOneProduct.replace(':id', productId),
      );

      // remove extra fields
      if (data) {
        delete data.sharing_formula;
        delete data.set_by;
        delete data.utilities;
        delete data.payment_providers;
        delete data.utility_batches;
        delete data.dependency;
        delete data.meta;
        delete data.document_url;
      }

      product = data;
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    return MyCoverAi.handleSuccessResponse(
      'Product fetched successfully',
      200,
      product,
    );
  }

  static async getOneUtility(utilityId: string) {
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
      200,
      utility,
    );
  }

  // static async purchase(productId: string, form: Form) {
  //   const endpoint = purchaseEndpoints[productId];

  //   if (!endpoint) throw new Error('Invalid ID');

  //   try {
  //     const { data } = await MyCoverAi.client.post(endpoint, form);
  //     return MyCoverAi.handleSuccessResponse(
  //       'Policy purchased',
  //       201,
  //       data.data,
  //     );
  //   } catch (error) {
  //     return MyCoverAi.handleFailResponse(error);
  //   }
  // }

  private static handleSuccessResponse(
    message: string,
    statusCode: number,
    data: any,
  ): McaResponse {
    return {
      responseCode: 1,
      statusCode,
      message,
      data,
    };
  }

  private static handleFailResponse(error: any): McaResponse {
    if (error instanceof FetchError) {
      return {
        responseCode: 0,
        statusCode: error?.response?.status as number,
        message: error?.message,
      };
    }

    return error;
  }

  private static throwError(message: string): never {
    throw new Error(message);
  }
}

export { PRODUCTS_RECOMMENDED, PRODUCT_CATEGORIES };
export default MyCoverAi;
