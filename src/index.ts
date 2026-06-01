import MyCoverGeniusFlexiCareForm from './products/myCoverGeniusFlexiCare/myCoverGeniusFlexiCare.form.interface';
import WellaHealthMalariaCoverForm from './products/wellaHealthMalariaCover/wellaHealthMalariaCover.form.interface';

import { ApiResponse, Form } from './products/shared/types';
import { McaResponse } from './products/shared/types';
import {
  purchaseEndpoints,
  productsEndpoints,
  auxiliaryEndpoints,
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

    let response: ApiResponse = {
      responseCode: 0,
      responseText: '',
    };

    try {
      response = await MyCoverAi.client.get(productsEndpoints.getAllProducts, {
        params,
      });
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }

    const products = response.data?.products;

    return MyCoverAi.handleSuccessResponse(
      'Products fetched successfully',
      200,
      products,
    );
  }

  static async getColors() {
    try {
      const { data } = await MyCoverAi.client.get(auxiliaryEndpoints.getColors);

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getGenders() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getGenders,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getVehicleTypes() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getVehicleTypes,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getManufactureYears() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getManufactureYears,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getCountries() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getCountries,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getCountriesWithStates() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getCountriesWithStates,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getStatesWithLocalGovernmentAreas() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getStatesWithLocalGovernmentAreas,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getLocalGovernmentAreasNigeria() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getLocalGovernmentAreasNigeria,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getIdentificationTypes() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getIdentificationTypes,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getOwnerTitles() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getOwnerTitles,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getVehicleBrandByProvider(
    year: string,
    provider: 'aiico' | 'leadway',
  ) {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getVehicleBrandByProvider,
        {
          params: {
            year,
            provider,
          },
        },
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getVehicleModelByProvider(
    year: string,
    makeId: string,
    provider: 'aiico' | 'leadway',
  ) {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getVehicleModelByProvider,
        {
          params: {
            year,
            make_id: makeId,
            provider,
          },
        },
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async getFlexiCareHospitals() {
    try {
      const { data } = await MyCoverAi.client.get(
        auxiliaryEndpoints.getFlexiCareHospitals,
      );

      return MyCoverAi.handleSuccessResponse(
        'Fetched successfully',
        200,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

  static async purchase(productId: string, form: Form) {
    const endpoint = purchaseEndpoints[productId];

    if (!endpoint) throw new Error('Invalid ID');

    try {
      const { data } = await MyCoverAi.client.post(endpoint, form);
      return MyCoverAi.handleSuccessResponse(
        'Policy purchased',
        201,
        data.data,
      );
    } catch (error) {
      return MyCoverAi.handleFailResponse(error);
    }
  }

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

export {
  PRODUCTS_RECOMMENDED,
  PRODUCT_CATEGORIES,
  MyCoverGeniusFlexiCareForm,
  WellaHealthMalariaCoverForm,
};
export default MyCoverAi;
