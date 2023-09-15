import axios, { AxiosInstance } from "axios";
import { filter, includes } from "lodash";

class MyCoverAi {
  // props
  private apiKey: string;
  private client: AxiosInstance;
  productIds: string[];

  buyInsurance: { form: any; buy: Function };

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.productIds = [];
    this.buyInsurance = { form: {}, buy: () => this.buy() };
    this.client = axios.create({
      baseURL: "https://staging.api.mycover.ai/v1",
      headers: {
        common: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    });
  }

  // Setters
  selectProducts(ids: string[]) {
    this.productIds = ids;
    return this;
  }

  selectCategories() {
    console.log("Selecting categories...");
  }

  // Methods
  async getAllProducts() {
    try {
      const response = await this.client.get("/products/get-all-products");
      const { products } = response.data.data;

      // if product ids are provided, filter the response and return only the selected products
      if (this.productIds.length) {
        return filter(products, (obj) => includes(this.productIds, obj.id));
      }

      // if categories are provided, filter the response and return only products under the given category

      return products;
    } catch (err: any) {
      return this.handleError(err);
    }
  }

  async buyAiicoAutoComprehensive() {
    console.log(this.productIds);
    if (!this.productIds.length) {
      throw new Error("Product ID not provided.");
    }
  }

  private buy() {
    console.log("Buying...");
  }

  private handleError(error: any) {
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

// Uncomment this section for testing - npm run dev - check console output
const API_KEY = "MCASECK_TEST|72b61e4d-f58a-4d38-82b7-4d4629997605";
// const mycoverai = new MyCoverAi(API_KEY);
const mycoverai = new MyCoverAi(API_KEY).selectProducts([
  "fab6bda1-b870-4648-8704-11c1802a51d0",
  "b9b4bca1-b870-4648-8704-11c1802a51d0",
  "a8b4bca1-b870-4648-8704-11c1802a51d0",
  "f7b4bca1-b870-4648-8704-11c1802a51d0",
  "cb7bbac7-55ef-4254-937a-33098e13d0d6",
]);

const getAllProducts = async () => {
  const allProducts = await mycoverai.getAllProducts();
  console.log(allProducts);
};

const buyAiicoAutoComprehensive = async () => {
  const purchaseData = await mycoverai.buyAiicoAutoComprehensive();
  console.log(purchaseData);
};

getAllProducts();
// buyAiicoAutoComprehensive();

mycoverai.buyInsurance.buy();

/*
APPROACH 1: Different method for each product purchase
Pros:
- Dedicated function for each product purchase, thus allowing for specific form data types
Cons:
- More public methods on the class object
- Unnecessary access to other products NOT included in the selectProducts method

APPROACH 2: One method for all products purchase
Pros:
- Lesser public methods on the class object
Cons:
- Dynamic form data types which could result in a conflict
*/

/*
[
  {
    id: "fab6bda1-b870-4648-8704-11c1802a51d0",
    name: "Wella Health Malaria Cover",
  },
  {
    id: "8179effb-e73b-433c-b44e-30625366d24e",
    name: "Tangerine Thirdparty Car",
  },
  {
    id: "2e87194d-5eb1-48b6-8837-a9cbc78d4ec3",
    name: "Tangerine Device",
  },
  {
    id: "dd81a37f-e621-4f9b-9427-5306b8a5b5e5",
    name: "Sovereign Trust Third Party",
  },
  {
    id: "b0d0f39c-0b8a-452f-a876-78bef8dde1d9",
    name: "Sovereign Trust Goods In Transit",
  },
  {
    id: "c1d0f39c-0b8a-452f-a876-78bef8dde1d9",
    name: "Sovereign Trust Cash In Transit",
  },
  {
    id: "b9b4bca1-b870-4648-8704-11c1802a51d0",
    name: "MyCoverGenius ZenCare Plus",
  },
  {
    id: "a8b4bca1-b870-4648-8704-11c1802a51d0",
    name: "MyCoverGenius ZenCare",
  },
  {
    id: "0ced01f3-7698-4101-a244-dd5d70e974c4",
    name: "MyCoverGenius Mini Comprehensive",
  },
  {
    id: "ffb0711c-1e4a-453b-a26c-2726e0a1a7bb",
    name: "MyCoverGenius Gadget Cover",
  },
  {
    id: "f7b4bca1-b870-4648-8704-11c1802a51d0",
    name: "MyCoverGenius FlexiCare Mini",
  },
  {
    id: "e6b4bca1-b870-4648-8704-11c1802a51d0",
    name: "MyCoverGenius FlexiCare",
  },
  {
    id: "f8b5bca1-b870-4648-8704-11c1802a51d0",
    name: "MyCoverGenius Credit Life",
  },
  {
    id: "d5b4bca1-b870-4648-8704-11c1802a51d0",
    name: "MyCoverGenius AccessPlan",
  },
  {
    id: "b112027d-5b49-4196-95c5-12b62b79878f",
    name: "Leadway Third Party",
  },
  {
    id: "404845dd-9032-4981-9ffa-595de9ab7ebb",
    name: "Leadway Personal Accident",
  },
  {
    id: "504845dd-9032-4981-9ffa-595de9ab7ebc",
    name: "Leadway Hospital Cash",
  },
  {
    id: "304845dd-9032-4981-9ffa-595de9ab7eba",
    name: "Leadway Comprehensive",
  },
  {
    id: "cb7bbac7-55ef-4254-937a-33098e13d0d6",
    name: "Hygeia Hyprime",
  },
  {
    id: "96774c1a-f062-4ace-9831-ef7f8ff47c69",
    name: "Hygeia Hybasic",
  },
  {
    id: "f3b14adb-f9ed-4541-894d-8ab137f048a4",
    name: "Custodian Travel Insurance",
  },
  {
    id: "e3b984d7-b155-4646-ac72-2de9707bfbbd",
    name: "Custodian Third Party",
  },
  {
    id: "f4c14adb-f9ed-4541-894d-8ab137f048b5",
    name: "Custodian Life Insurance",
  },
  {
    id: "f2b14adb-f9ed-4541-894d-8ab137f048a3",
    name: "Custodian Home Shield",
  },
  {
    id: "f1b14adb-f9ed-4541-894d-8ab137f048a2",
    name: "Custodian Comprehensive ",
  },
];
*/

export default MyCoverAi;
