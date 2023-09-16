// Following Sendgrid sdk pattern: https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs

import axios, { AxiosInstance } from "axios";
import { filter, includes, forEach, isEmpty, values } from "lodash";

import { ACTIVE_PRODUCTS_IDS, PRODUCT_CATEGORIES } from "./constant";

class MyCoverAi {
  constructor() {}
  // props
  private static apiKey: string;
  private static selectedProductsIds: { [key: string]: string };
  private static selectedCategory: string;
  private static client: AxiosInstance;

  static PRODUCT_ID = ACTIVE_PRODUCTS_IDS;
  static PRODUCT_CATEGORY = PRODUCT_CATEGORIES;
  static buyInsurance: { form: any; buy: Function };
  // this.buyInsurance = { form: {}, buy: () => this.buy() };

  // Setters
  static setApiKey(key: string) {
    MyCoverAi.apiKey = key;
    MyCoverAi.client = axios.create({
      baseURL: "https://staging.api.mycover.ai/v1",
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

    forEach(MyCoverAi.PRODUCT_ID, function (value, key) {
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

  // Methods
  static async getFullProducts() {
    try {
      const response = await MyCoverAi.client.get("/products/get-all-products");
      const { products } = response.data.data;

      // if product ids are provided, filter the response and return only the selected products
      if (!isEmpty(MyCoverAi.selectedProductsIds)) {
        const selectedProductsIds = values(MyCoverAi.selectedProductsIds);
        return filter(products, (obj) =>
          includes(values(selectedProductsIds), obj.id)
        );
      }

      // if categories are provided, filter the response and return only products under the given category
      if (MyCoverAi.selectedCategory) {
        return filter(
          products,
          (obj) => obj.productCategory.name === MyCoverAi.selectedCategory
        );
      }

      return products;
    } catch (err: any) {
      return MyCoverAi.handleError(err);
    }
  }

  private static buy() {
    console.log("Buying...");
  }

  private static handleError(error: any) {
    if (axios.isAxiosError(error)) {
      return {
        responseCode: error?.response?.data?.responseCode,
        responseText: error?.response?.data?.responseText,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        message: error?.response?.data?.responseText,
      };
    }

    return error;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const myCoverAi = MyCoverAi; // similar to import myCoverAi from '@mycoverai/nodejs';

const API_KEY = "MCASECK_TEST|72b61e4d-f58a-4d38-82b7-4d4629997605";
myCoverAi.setApiKey(API_KEY);

// myCoverAi.setApiKey(API_KEY).setCategory(MyCoverAi.PRODUCT_CATEGORY.Auto);
myCoverAi.setProducts([
  myCoverAi.PRODUCT_ID.HygeiaHybasic,
  myCoverAi.PRODUCT_ID.HygeiaHyprime,
  myCoverAi.PRODUCT_ID.MyCoverGeniusFlexiCare,
  myCoverAi.PRODUCT_ID.MyCoverGeniusFlexiCareMini,
  myCoverAi.PRODUCT_ID.WellaHealthMalariaCover,
]);

const getFullProducts = async () => {
  const allProducts = await myCoverAi.getFullProducts();
  console.log(allProducts);
};

getFullProducts();

// myCoverAi.buyInsurance.buy();
