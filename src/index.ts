import axios from 'axios';
import { filter, includes, forEach, isEmpty, values } from 'lodash';

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

class MyCoverAi {
  constructor() {}
  // props
  private static baseURL = 'https://api.mycover.ai/v1';
  private static apiKey: string;
  private static selectedProductsIds: { [key: string]: string };
  private static selectedCategory: string;
  private static client = axios.create({
    baseURL: MyCoverAi.baseURL,
  });

  static products = activeProducts;
  static productsIds = activeProductsIds;
  static productsCategories = productsCategories;

  // Setters
  static setApiKey(key: string) {
    MyCoverAi.apiKey = key;
    MyCoverAi.client = axios.create({
      baseURL: MyCoverAi.baseURL,
      headers: {
        common: {
          Authorization: MyCoverAi.apiKey ? `Bearer ${MyCoverAi.apiKey}` : null,
        },
      },
    });

    return this;
  }

  static setProducts(ids: string[]) {
    const hash: { [key: string]: string } = {};

    forEach(MyCoverAi.productsIds, function (value, key) {
      if (ids.includes(value)) {
        hash[key] = value;
      }
    });

    MyCoverAi.selectedProductsIds = hash;
    return this;
  }

  static setCategory(category: string) {
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

      let products = response.data.data?.products;

      // if product ids are provided, filter the response and return only the selected products
      if (!isEmpty(MyCoverAi.selectedProductsIds)) {
        const selectedProductsIds = values(MyCoverAi.selectedProductsIds);
        products = filter(products, (obj) =>
          includes(values(selectedProductsIds), obj.id),
        );

        return MyCoverAi.handleSuccessResponse('All products', 200, products);
      }

      // if categories are provided, filter the response and return only products under the given category
      if (MyCoverAi.selectedCategory) {
        products = filter(
          products,
          (obj) => obj.productCategory.name === MyCoverAi.selectedCategory,
        );

        return MyCoverAi.handleSuccessResponse('All products', 200, products);
      }

      const allProductsIds = values(MyCoverAi.productsIds);
      products = filter(products, (obj) =>
        includes(values(allProductsIds), obj.id),
      );

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
    if (axios.isAxiosError(error)) {
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
}

export { MyCoverGeniusFlexiCareForm, WellaHealthMalariaCoverForm };
export default MyCoverAi;
