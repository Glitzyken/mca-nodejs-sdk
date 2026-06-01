import MyCoverGeniusFlexiCareForm from './products/myCoverGeniusFlexiCare/myCoverGeniusFlexiCare.form.interface';
import WellaHealthMalariaCoverForm from './products/wellaHealthMalariaCover/wellaHealthMalariaCover.form.interface';

import { Form } from './products/shared/types';
import { MCAResponse } from './products/shared/types';
import {
  activeProductsIds,
  productsCategories,
  purchaseEndpoints,
  productsEndpoints,
  auxiliaryEndpoints,
} from './products/shared/constant';
import activeProducts from './products';
import { isEmpty } from './utils/lodash-es';
import { FetchClient } from './utils/client';

class MyCoverAi {
  constructor() {}

  // props
  private static baseURL = 'https://v2.api.mycover.ai/v2';
  private static apiKey: string;
  private static selectedProductsIds: { [key: string]: string };
  private static selectedCategory: string;
  private static client = new FetchClient({
    baseURL: MyCoverAi.baseURL,
  });

  static products = activeProducts;
  static productsIds = activeProductsIds;
  static productsCategories = productsCategories;

  // Setters
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

  static setProducts(ids: string[]) {
    if (!ids?.length) {
      MyCoverAi.throwError('Product IDs are required');
    }

    const hash: { [key: string]: string } = {};

    for (const key in MyCoverAi.productsIds) {
      const value =
        MyCoverAi.productsIds[key as keyof typeof MyCoverAi.productsIds];

      if (ids.includes(value)) {
        hash[key] = value;
      }
    }

    MyCoverAi.selectedProductsIds = hash;

    return this;
  }

  static setCategory(category: string) {
    if (!category) {
      MyCoverAi.throwError('Category is required');
    }

    MyCoverAi.selectedCategory = category;

    return this;
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

  static async getProducts() {
    try {
      const response = await MyCoverAi.client.get(
        productsEndpoints.getAllProducts,
      );

      const products = response.data.data?.products;

      // if product ids are provided, filter the response and return only the selected products
      if (!isEmpty(MyCoverAi.selectedProductsIds)) {
        // const selectedProductsIds = values(MyCoverAi.selectedProductsIds);
        // products = filter(products, (obj) =>
        //   includes(values(selectedProductsIds), obj.id),
        // );
        // return MyCoverAi.handleSuccessResponse('All products', 200, products);
      }

      // if categories are provided, filter the response and return only products under the given category
      if (MyCoverAi.selectedCategory) {
        // products = products.filter(
        //   (obj) => obj.productCategory.name === MyCoverAi.selectedCategory,
        // );
        // return MyCoverAi.handleSuccessResponse('All products', 200, products);
      }

      const allProductsIds = Object.values(MyCoverAi.productsIds);
      console.log('✅', allProductsIds);
      // products = filter(products, (obj) =>
      //   includes(values(allProductsIds), obj.id),
      // );

      return MyCoverAi.handleSuccessResponse('All products', 200, products);
    } catch (error: any) {
      return MyCoverAi.handleFailResponse(error);
    }
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

  private static handleSuccessResponse(
    message: string,
    statusCode: number,
    data: any,
  ): MCAResponse {
    return {
      responseCode: 1,
      responseText: message,
      statusCode,
      data,
    };
  }

  private static handleFailResponse(error: any): MCAResponse {
    if (error && (error.response || error.isFetchError)) {
      return {
        responseCode: 0,
        responseText: error?.response?.data?.responseText,
        statusCode: error?.response?.status as number,
        statusText: error?.response?.statusText,
        message: error?.response?.data?.responseText,
      };
    }

    return error;
  }

  private static throwError(message: string): never {
    throw new Error(message);
  }
}

export { MyCoverGeniusFlexiCareForm, WellaHealthMalariaCoverForm };
export default MyCoverAi;
