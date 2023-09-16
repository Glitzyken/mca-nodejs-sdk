// Following Sendgrid sdk pattern: https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs

import axios, { AxiosInstance } from "axios";
import { filter, includes, forEach, isEmpty, values } from "lodash";

import { Form } from "./products/shared/types";
import {
  ACTIVE_PRODUCTS_IDS,
  PRODUCT_CATEGORIES,
  purchaseEndpoints,
  productsEndpoints,
} from "./products/shared/constant";
import activeProducts from "./products";

class MyCoverAi {
  constructor() {}
  // props
  private static apiKey: string;
  private static selectedProductsIds: { [key: string]: string };
  private static selectedCategory: string;
  private static client: AxiosInstance;

  static products = activeProducts;
  static PRODUCTS_IDS = ACTIVE_PRODUCTS_IDS;
  static PRODUCT_CATEGORIES = PRODUCT_CATEGORIES;

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

    forEach(MyCoverAi.PRODUCTS_IDS, function (value, key) {
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
      const response = await MyCoverAi.client.get(
        productsEndpoints.getAllProducts
      );
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
    } catch (error: any) {
      return MyCoverAi.handleError(error);
    }
  }

  static async purchase(productId: string, form: Form) {
    const endpoint = purchaseEndpoints[productId];
    console.log(MyCoverAi.products.wellaHealthMalariaCover.form);

    try {
      const { data } = await MyCoverAi.client.post(endpoint, form);
      return data;
    } catch (error) {
      return MyCoverAi.handleError(error);
    }
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
import CustodianComprehensiveForm from "./products/custodianComprehensive/custodianComprehensive.form.interface"; // similar to import { CustodianComprehensiveForm } from '@mycoverai/nodejs';
import WellaHealthMalariaCoverForm from "./products/wellaHealthMalariaCover/wellaHealthMalariaCover.form.interface";

const API_KEY = "MCASECK_TEST|72b61e4d-f58a-4d38-82b7-4d4629997605";
myCoverAi.setApiKey(API_KEY);

// myCoverAi.setApiKey(API_KEY).setCategory(MyCoverAi.PRODUCT_CATEGORIES.Auto);
myCoverAi.setProducts([
  myCoverAi.PRODUCTS_IDS.HygeiaHybasic,
  myCoverAi.PRODUCTS_IDS.HygeiaHyprime,
  myCoverAi.PRODUCTS_IDS.MyCoverGeniusFlexiCare,
  myCoverAi.PRODUCTS_IDS.MyCoverGeniusFlexiCareMini,
  myCoverAi.PRODUCTS_IDS.WellaHealthMalariaCover,
]);

const getFullProducts = async () => {
  const allProducts = await myCoverAi.getFullProducts();
  console.log({ allProducts });
};

const buyWellaHealthMalaria = async () => {
  const id = myCoverAi.PRODUCTS_IDS.WellaHealthMalariaCover;
  const form: WellaHealthMalariaCoverForm = {
    date_of_birth: "1978-05-04",
    gender: "Male",
    address: "14th street, Lagos",
    image_url: "https://via.placeholder.com/300/09f/fff.png",
    first_name: "Emerson",
    last_name: "Craig",
    email: "johndoe@gmail.com",
    phone_number: "+2349026378299",
    payment_plan: "Monthly",
    product_id: "fab6bda1-b870-4648-8704-11c1802a51d0",
  };

  MyCoverAi.products.wellaHealthMalariaCover.form = form;

  const result = await myCoverAi.purchase(id, form);
  console.log({ result });
};

const buyCustodianComprehensive = async () => {
  const id = myCoverAi.PRODUCTS_IDS.CustodianComprehensive;
  // const { form } = myCoverAi.products.custodianComprehensive;
  // form.first_name = "Kenneth";
  // form.last_name = "Jimmy";
  // form.email = "kenjimmy17@gmail.com";
  // etc...

  // or...
  const form: CustodianComprehensiveForm = {
    vehicle_make: "1",
    vehicle_model: "218",
    address: "close 4 festac town lagos",
    insurance_start_date: "2022-12-08",
    vehicle_registration_number: "akd543gf",
    engine_number: "2GR0455283",
    chassis_number: "JTNBK40K303034861",
    vehicle_year_manufactured: "2019",
    vehicle_type: "Suv",
    vehicle_color: "RED",
    vehicle_insurance_type: "Private",
    vehicle_value: 3000000,
    first_name: "peter",
    last_name: "akinwumi",
    email: "peter.akinwumi@gmail.com",
    dob: "1987-04-28",
    phone: "07064378577",
    product_id: id,
  };

  myCoverAi.products.custodianComprehensive.form = form;

  const result = await myCoverAi.purchase(id, form);
  console.log(result);
};

// getFullProducts()
// buyCustodianComprehensive();
buyWellaHealthMalaria();
