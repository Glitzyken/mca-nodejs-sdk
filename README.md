# MyCover.ai Node.js SDK

> Seamlessly integrate Africa's foremost insure-tech infrastructure into your Node.js/Nest.js application.

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/mca-nodejs-sdk)
[![license](https://img.shields.io/badge/license-Apache%202.0-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

<!-- ============================================= -->
<!-- 1. DISCLAIMER -->
<!-- ============================================= -->

> **⚠️ Unofficial SDK**
>
> This is an **unofficial**, community-maintained Node.js SDK for the [MyCover.ai](https://mycover.ai) API. It is **not officially affiliated with, endorsed by, or maintained by MyCover.ai**. It was built independently to make integrating with the MyCover.ai API easier for the Node.js community.
>
> "MyCover.ai" and any associated logos are trademarks of their respective owner and are used here solely to describe API compatibility. For official support, please refer to [MyCover.ai's official documentation](https://docs.mycover.ai) or support channels.
>
> This SDK is provided "as is," without warranty of any kind. See the [License](#license) section for full details.


<!-- ============================================= -->
<!-- 2. LICENSE SECTION -->
<!-- ============================================= -->

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [setApiKey](#setapikey)
  - [setProducts](#setproducts)
  - [setCategory](#setcategory)
- [Interfaces](#interfaces)
  - [IMcaResponse](#imcaresponse)
  - [IBuyForm](#ibuyform)
- [Exported Constants](#exported-constants)
  - [PRODUCT_CATEGORIES](#product_categories)
  - [PRODUCTS_RECOMMENDED](#products_recommended)
- [Methods](#methods)
  - [Products](#products)
    - [fetchProducts](#fetchproducts)
    - [fetchOneProduct](#fetchoneproduct)
    - [fetchOneUtility](#fetchoneutility)
  - [Insurance Transactions](#insurance-transactions)
    - [calculatePremium](#calculatepremium)
    - [buy](#buy)
    - [renew](#renew)
  - [Policies](#policies)
    - [fetchPolicies](#fetchpolicies)
    - [fetchOnePolicy](#fetchonepolicy)
  - [Claims](#claims)
    - [fetchClaims](#fetchclaims)
    - [fetchOneClaim](#fetchoneclaim)
  - [Customers](#customers)
    - [fetchCustomers](#fetchcustomers)
    - [fetchOneCustomer](#fetchonecustomer)
    - [fetchCustomerPurchases](#fetchcustomerpurchases)
    - [fetchCustomerPolicies](#fetchcustomerpolicies)
  - [Purchases](#purchases)
    - [fetchPurchases](#fetchpurchases)
    - [fetchOnePurchase](#fetchonepurchase)
- [Error Handling](#error-handling)
- [Fluent API (Method Chaining)](#fluent-api-method-chaining)
- [Running Tests](#running-tests)

---

## Overview

The **MyCover.ai Node.js SDK** is an unofficial, developer-friendly TypeScript library that wraps the [MyCover.ai v2 REST API](docs.mycover.ai). It provides a clean, strongly-typed, static class interface for working with:

- **Products** — Browse and filter insurance products
- **Premiums** — Calculate insurance premiums before purchase
- **Purchases** — Buy and renew insurance policies
- **Policies** — Manage active policies
- **Claims** — Track and retrieve insurance claims
- **Customers** — Manage customer records

All methods return a consistent `IMcaResponse` object, making it trivial to handle both success and error states uniformly throughout your application.

---

## Installation

```bash
npm install mca-nodejs-sdk
```

> **Note:** This package ships with TypeScript type declarations out of the box. No `@types/` package is needed.

---

## Quick Start

```typescript
import MyCoverAi, { PRODUCT_CATEGORIES, PRODUCTS_RECOMMENDED } from 'mca-nodejs-sdk';

// 1. Initialize with your API key
MyCoverAi.setApiKey('your-api-key-here');

// 2. (Optional) Scope requests to specific products or categories
MyCoverAi
  .setProducts([PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto])
  .setCategory([PRODUCT_CATEGORIES.Auto]);

// 3. Fetch products
const response = await MyCoverAi.fetchProducts({ page: 1, limit: 10 });

if (response.code === 1) {
  console.log('Products:', response.data);
  console.log('Total:', response.meta?.totalCount);
} else {
  console.error('Error:', response.message);
}
```

---

## Configuration

These three static methods configure the SDK. They support **method chaining** and must be called before any data-fetching methods.

---

### `setApiKey`

Authenticates the SDK with your MyCover.ai API key. This must be called **first** before making any API requests.

**Signature:**

```typescript
static setApiKey(key: string): typeof MyCoverAi
```

**Parameters:**

| Parameter | Type     | Required | Description                                                  |
| --------- | -------- | -------- | ------------------------------------------------------------ |
| `key`     | `string` | ✅ Yes    | Your MyCover.ai API key [here](https://docs.mycover.ai/getting-started/authentication). |

**Returns:** `typeof MyCoverAi` — The class itself, enabling method chaining.

**Throws:** `Error` with message `"SDK Error: API Key is required"` if `key` is empty or falsy.

**Example:**

```typescript
MyCoverAi.setApiKey('MCASECK_TEST|xxxxxxxxxxxx');
```

---

### `setProducts`

Scopes subsequent `fetchProducts` calls to a specific list of product IDs. Only valid UUIDs are retained; invalid ones are silently filtered out.

**Signature:**

```typescript
static setProducts(productIds: string[]): typeof MyCoverAi
```

**Parameters:**

| Parameter    | Type       | Required | Description                                                  |
| ------------ | ---------- | -------- | ------------------------------------------------------------ |
| `productIds` | `string[]` | ✅ Yes    | An array of product UUIDs to filter by. Must have at least one. |

**Returns:** `typeof MyCoverAi` — The class itself, enabling method chaining.

**Throws:** `Error` with message `"SDK Error: Please provide at least one product ID"` if the array is empty or not provided.

> **Tip:** Use the exported `PRODUCTS_RECOMMENDED` constant to avoid hardcoding UUIDs.

**Example:**

```typescript
import { PRODUCTS_RECOMMENDED } from 'mca-nodejs-sdk';

MyCoverAi.setProducts([
  PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto,
  PRODUCTS_RECOMMENDED.HEALTH.PrimeCare,
]);
```

---

### `setCategory`

Scopes subsequent `fetchProducts` calls to one or more insurance categories. Only valid category values from `PRODUCT_CATEGORIES` are retained.

**Signature:**

```typescript
static setCategory(
  categories: (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES][]
): typeof MyCoverAi
```

**Parameters:**

| Parameter    | Type                   | Required | Description                                                 |
| ------------ | ---------------------- | -------- | ----------------------------------------------------------- |
| `categories` | `PRODUCT_CATEGORIES[]` | ✅ Yes    | An array of category UUID values from `PRODUCT_CATEGORIES`. |

**Returns:** `typeof MyCoverAi` — The class itself, enabling method chaining.

**Throws:** `Error` with message `"SDK Error: Please provide a category"` if the array is empty or not provided.

**Example:**

```typescript
import { PRODUCT_CATEGORIES } from 'mca-nodejs-sdk';

MyCoverAi.setCategory([
  PRODUCT_CATEGORIES.Auto,
  PRODUCT_CATEGORIES.Health,
]);
```

---

## Interfaces

### `IMcaResponse`

Every public method in the SDK returns a `Promise<IMcaResponse>`. This is the unified response envelope.

```typescript
interface IMcaResponse {
  /** 1 = success, 0 = failure */
  code: number;

  /** Human-readable description of the result. */
  message: string;

  /** The response payload. Present on success, absent on failure. */
  data?: any;

  /**
   * Pagination metadata. Present on list endpoints.
   * Contains: page, limit, totalCount.
   */
  meta?: Record<string, any>;
}
```

**Field Details:**

| Field     | Type                  | Description                                                  |
| --------- | --------------------- | ------------------------------------------------------------ |
| `code`    | `1 \| 0`              | `1` on success, `0` on API-level failure.                    |
| `message` | `string`              | A human-readable status message (e.g., `"Products fetched successfully"`). |
| `data`    | `any`                 | The primary response payload — an object or array depending on the endpoint. |
| `meta`    | `Record<string, any>` | Pagination info on list endpoints: `{ page, limit, totalCount }`. |

---

### `IBuyForm`

The form shape required by the [`buy`](#buy) method to purchase an insurance policy.

```typescript
interface IBuyForm {
  /** Customer's legal first name */
  first_name: string;

  /** Customer's legal last name */
  last_name: string;

  /** Customer's email address */
  email: string;

  /** Customer's date of birth — as it appears on legal documents */
  date_of_birth: string;

  /** Customer's phone number */
  phone_number: string;

  /** Customer's gender */
  gender: 'Male' | 'Female';

  /** Customer's home address */
  address: string;

  /** Whether the policy is purchased for the customer themselves */
  bought_for_self: boolean;

  /** Optional: National Identity Number (NIN) */
  nin?: string;

  /** Any additional product-specific fields */
  [key: string]: any;
}
```

> **Note:** Different insurance products may require additional fields beyond the base `IBuyForm`. Consult the MyCover.ai product documentation for product-specific payload requirements.

---

## Exported Constants

### `PRODUCT_CATEGORIES`

A map of human-readable category names to their corresponding UUIDs on the MyCover.ai platform. Use these values with [`setCategory`](#setcategory) and [`fetchPolicies`](#fetchpolicies).

```typescript
import { PRODUCT_CATEGORIES } from 'mca-nodejs-sdk';

// Available keys:
PRODUCT_CATEGORIES.Package       // '14fb5968-48d2-49ac-88a8-0ee40e01fcca'
PRODUCT_CATEGORIES.Gadget        // '1e87194d-5eb1-48b6-8837-a9cbc78d4ec3'
PRODUCT_CATEGORIES['Agency Banking'] // '62d58862-38dd-4d9c-affc-95102e8fbc8b'
PRODUCT_CATEGORIES.Life          // '704f6261-3710-48e5-a894-ffc4d6bdc381'
PRODUCT_CATEGORIES['Credit Life'] // '814f6261-3710-48e5-a894-ffc4d6bdc381'
PRODUCT_CATEGORIES.Auto          // '978ced0d-0e05-4de6-b43a-b408c0e8b95e'
PRODUCT_CATEGORIES.Health        // '9d78bc79-3fa8-447d-b688-e42c1c6838a0'
PRODUCT_CATEGORIES.Content       // '9e9d5fe0-2129-41a5-9f44-9c9fe90b3855'
PRODUCT_CATEGORIES.Travel        // 'f3933c0d-ef7c-4287-90bd-744cf00c8426'
```

---

### `PRODUCTS_RECOMMENDED`

A curated registry of well-known MyCover.ai product IDs, organized by category. This allows you to reference products by name rather than raw UUID strings.

```typescript
import { PRODUCTS_RECOMMENDED } from 'mca-nodejs-sdk';
```

| Category  | Products Available                                           |
| --------- | ------------------------------------------------------------ |
| `AUTO`    | `CoronationComprehensiveAuto`, `CoronationMotorMaxBronze`, `CoronationMotorMaxSilver`, `CoronationMotorMaxGold`, `MiniComprehensiveAuto`, `MicroComprehensiveAuto`, `MonthlyComprehensiveAuto`, `ThirdPartyAuto`, `ThirdPartyBikeCover`, `AIICOComprehensiveAuto`, `STIComprehensiveAuto`, `SanlamComprehensiveAuto` |
| `HEALTH`  | `PrimeCare`, `PrimeCarePlus`, `FlexiCareMiniRetail`, `FlexiCareRetail`, `Seniors`, `SeniorsPlus`, `SeniorsPrime`, `ZenCareRetail`, `ZenCarePlusRetail`, `ZenCarePrimeRetail` |
| `GADGET`  | `DeviceCover`, `FlexiGuard`, `FlexiGuardMini`, `FlexiGuardPlus`, `LaptopInsuranceBasic`, `LaptopInsuranceStandard`, `PrimeProtect`, `PrimeProtectPlus` |
| `LIFE`    | `LifeCover`, `AccidentCover`, `CreditLife`, `CredPlus`, `DefaultCreditLife`, `FlexiMoveBasic`, `FlexiMoveEssential`, `FlexiMovePlus`, `HospicashBasic`, `HospicashEssential`, `HospicashPlus`, `HospitalCashCover`, `PersonalAccidentCover` |
| `TRAVEL`  | `TravelCover`                                                |
| `PACKAGE` | `MarineCoverCappedImportAndExport`, `MarineCoverImportAndExport`, `OnDemandGoodsInTransit`, `OnDemandGoodsInTransitCapped` |
| `CONTENT` | `BuildingCover`, `CoronationHomeContentCover`, `AIICOHomeContentCover`, `SanlamHomeContentCover`, `ShopContentCover` |

**Example:**

```typescript
const productId = PRODUCTS_RECOMMENDED.GADGET.DeviceCover;
// '46240c74-fc6f-42f5-a0d2-66800b22d9aa'
```

---

## Methods

All methods are **static** on the `MyCoverAi` class. They are all `async` (returning `Promise<IMcaResponse>`) unless noted otherwise.

---

## Products

### `fetchProducts`

Retrieves a paginated list of insurance products. The results can be pre-filtered by calling [`setProducts`](#setproducts) and/or [`setCategory`](#setcategory) before calling this method.

**Signature:**

```typescript
static async fetchProducts(options: {
  page?: number;
  limit?: number;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter | Type     | Required | Default | Description                 |
| --------- | -------- | -------- | ------- | --------------------------- |
| `page`    | `number` | ❌ No     | `1`     | Page number for pagination. |
| `limit`   | `number` | ❌ No     | `10`    | Number of results per page. |

**Response `data`:** `Array` of product objects.

**Response `meta`:** `{ page, limit, totalCount }`

**Example:**

```typescript
const response = await MyCoverAi.fetchProducts({ page: 1, limit: 20 });

if (response.code === 1) {
  const { data: products, meta } = response;
  console.log(`Showing ${products.length} of ${meta?.totalCount} products`);
}
```

---

### `fetchOneProduct`

Retrieves a single insurance product by its UUID. Internal fields (e.g., `sharing_formula`, `utilities`, `payment_providers`) are automatically stripped from the response.

**Signature:**

```typescript
static async fetchOneProduct(productId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type     | Required | Description                              |
| ----------- | -------- | -------- | ---------------------------------------- |
| `productId` | `string` | ✅ Yes    | A valid UUID of the product to retrieve. |

**Response `data`:** A single product object (internal fields stripped).

**Throws:**

- `"SDK Error: product id is required"` — if `productId` is missing.
- `"SDK Error: Invalid product id"` — if `productId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchOneProduct(
  PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto
);

if (response.code === 1) {
  console.log('Product name:', response.data.name);
}
```

---

### `fetchOneUtility`

Retrieves a single utility object by its UUID. Utilities are supplementary data objects associated with specific insurance products (e.g., vehicle makes, hospital lists). Refer to the [MyCoverAi doc](https://docs.mycover.ai/api-preference/operational/auxiliary) for more information.

**Signature:**

```typescript
static async fetchOneUtility(utilityId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type     | Required | Description                              |
| ----------- | -------- | -------- | ---------------------------------------- |
| `utilityId` | `string` | ✅ Yes    | A valid UUID of the utility to retrieve. |

**Response `data`:** A utility object.

**Throws:**

- `"SDK Error: utility id is required"` — if `utilityId` is missing.
- `"SDK Error: Invalid utility id"` — if `utilityId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchOneUtility('some-utility-uuid');

if (response.code === 1) {
  console.log('Utility data:', response.data);
}
```

---

## Insurance Transactions

### `calculatePremium`

Calculates the insurance premium for a given product and form data before committing to a purchase. Use this to show users a cost estimate.

**Signature:**

```typescript
static async calculatePremium(
  productId: string,
  form: Record<string, any>
): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type                  | Required | Description                                                  |
| ----------- | --------------------- | -------- | ------------------------------------------------------------ |
| `productId` | `string`              | ✅ Yes    | A valid UUID of the product to calculate the premium for.    |
| `form`      | `Record<string, any>` | ✅ Yes    | Product-specific form data (e.g., `value`, `cover_period`, etc). Each product detail page has its required payload for fetching its premium. See the [MyCoverAi doc](https://docs.mycover.ai/products/45140c74-fc6f-42f5-a0d2-66800b22d999) for more information. |

**Response `data`:** An object containing the calculated premium amount and currency (e.g., `{ price: 5000 }`).

**Throws:**

- `"SDK Error: product id is required"` — if `productId` is missing.
- `"SDK Error: Invalid product id"` — if `productId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.calculatePremium(
  PRODUCTS_RECOMMENDED.AUTO.ComprehensiveAuto,
  {
    vehicle_value: 6500000,
    vehicle_model: 'Camry',
  }
);

if (response.code === 1) {
  console.log('Estimated premium:', response.data.price);
}
```

---

### `buy`

Purchases an insurance policy for a customer. The `form` parameter must satisfy the `IBuyForm` interface, and may include additional product-specific fields.

**Signature:**

```typescript
static async buy<T extends IBuyForm>(
  productId: string,
  form: T
): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type                 | Required | Description                                                  |
| ----------- | -------------------- | -------- | ------------------------------------------------------------ |
| `productId` | `string`             | ✅ Yes    | A valid UUID of the product to purchase.                     |
| `form`      | `T extends IBuyForm` | ✅ Yes    | Customer and product-specific details. See [`IBuyForm`](#ibuyform). |

**Response `data`:** A policy/purchase object including the policy number and status (e.g., `{ policy_number: "...", is_active: true }`).

**Throws:**

- `"SDK Error: product id is required"` — if `productId` is missing.
- `"SDK Error: Invalid product id"` — if `productId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.buy(PRODUCTS_RECOMMENDED.LIFE.AccidentCover, {
  first_name: 'Amara',
  last_name: 'Okonkwo',
  email: 'amara@example.com',
  date_of_birth: '1992-05-14',
  phone_number: '2348012345678',
  gender: 'Female',
  address: '5 Broad Street, Lagos',
  bought_for_self: true,
});

if (response.code === 1) {
  console.log('Policy created:', response.data.policy_number);
} else {
  console.error('Purchase failed:', response.message);
}
```

---

### `renew`

Renews an existing insurance policy identified by its `policyId`.

**Signature:**

```typescript
static async renew(
  policyId: string,
  payload: Record<string, any>
): Promise<IMcaResponse>
```

**Parameters:**

| Parameter  | Type                  | Required | Description                                                  |
| ---------- | --------------------- | -------- | ------------------------------------------------------------ |
| `policyId` | `string`              | ✅ Yes    | A valid UUID of the policy to renew.                         |
| `payload`  | `Record<string, any>` | ✅ Yes    | Renewal-specific data required by the product (may be an empty object). |

**Response `data`:** A renewal confirmation object (e.g., `{ policy_number: "..." }`).

**Throws:**

- `"SDK Error: policy id is required"` — if `policyId` is missing.
- `"SDK Error: Invalid policy id"` — if `policyId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.renew('policy-uuid-here', {
  // product-specific renewal fields
});

if (response.code === 1) {
  console.log('Policy renewed:', response.data);
}
```

---

## Policies

### `fetchPolicies`

Retrieves a paginated, filterable list of insurance policies.

**Signature:**

```typescript
static async fetchPolicies(options: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  productId?: string;
  activatedAtStart?: string;
  activatedAtEnd?: string;
  expiredAtStart?: string;
  expiredAtEnd?: string;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter          | Type      | Required | Default | Description                                                  |
| ------------------ | --------- | -------- | ------- | ------------------------------------------------------------ |
| `page`             | `number`  | ❌ No     | `1`     | Page number.                                                 |
| `limit`            | `number`  | ❌ No     | `10`    | Results per page.                                            |
| `search`           | `string`  | ❌ No     | —       | Free-text search across policy fields.                       |
| `isActive`         | `boolean` | ❌ No     | —       | Filter by active (`true`) or inactive (`false`) policies.    |
| `productId`        | `string`  | ❌ No     | —       | Filter by a specific product UUID.                           |
| `activatedAtStart` | `string`  | ❌ No     | —       | Filter policies activated on or after this date (`yyyy-mm-dd`). |
| `activatedAtEnd`   | `string`  | ❌ No     | —       | Filter policies activated on or before this date (`yyyy-mm-dd`). |
| `expiredAtStart`   | `string`  | ❌ No     | —       | Filter policies expiring on or after this date (`yyyy-mm-dd`). |
| `expiredAtEnd`     | `string`  | ❌ No     | —       | Filter policies expiring on or before this date (`yyyy-mm-dd`). |

**Response `data`:** `Array` of policy objects.

**Response `meta`:** `{ page, limit, totalCount }`

**Throws:**

- `"SDK Error: Invalid product id"` — if `productId` is provided but not a valid UUID.
- `"SDK Error: Invalid date: ..."` — if any date filter is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await MyCoverAi.fetchPolicies({
  page: 1,
  limit: 10,
  isActive: true,
  activatedAtStart: '2026-01-01',
  activatedAtEnd: '2026-12-31',
});

if (response.code === 1) {
  console.log('Active policies this year:', response.data);
}
```

---

### `fetchOnePolicy`

Retrieves a single policy by its UUID.

**Signature:**

```typescript
static async fetchOnePolicy(policyId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter  | Type     | Required | Description                             |
| ---------- | -------- | -------- | --------------------------------------- |
| `policyId` | `string` | ✅ Yes    | A valid UUID of the policy to retrieve. |

**Response `data`:** A single policy object.

**Throws:**

- `"SDK Error: policy id is required"` — if `policyId` is missing.
- `"SDK Error: Invalid policy id"` — if `policyId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchOnePolicy('policy-uuid-here');

if (response.code === 1) {
  console.log('Policy status:', response.data.is_active);
}
```

---

## Claims

### `fetchClaims`

Retrieves a paginated, filterable list of insurance claims.

**Signature:**

```typescript
static async fetchClaims(options: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type     | Required | Default | Description                                                  |
| ------------ | -------- | -------- | ------- | ------------------------------------------------------------ |
| `page`       | `number` | ❌ No     | `1`     | Page number.                                                 |
| `limit`      | `number` | ❌ No     | `10`    | Results per page.                                            |
| `status`     | `string` | ❌ No     | —       | Filter by claim status (e.g., `"Pending"`, `"Approved"`, `"Declined"`). |
| `type`       | `string` | ❌ No     | —       | Filter by claim type (e.g., `"Vehicle"`, `"Gadget"`).        |
| `customerId` | `string` | ❌ No     | —       | Filter claims belonging to a specific customer UUID.         |
| `startDate`  | `string` | ❌ No     | —       | Filter claims created on or after this date (`yyyy-mm-dd`).  |
| `endDate`    | `string` | ❌ No     | —       | Filter claims created on or before this date (`yyyy-mm-dd`). |
| `search`     | `string` | ❌ No     | —       | Free-text search across claim fields.                        |

**Response `data`:** `Array` of claim objects.

**Response `meta`:** `{ page, limit, totalCount }`

**Throws:**

- `"SDK Error: Invalid customer id"` — if `customerId` is provided but not a valid UUID.
- `"SDK Error: Invalid date: ..."` — if `startDate` or `endDate` is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await MyCoverAi.fetchClaims({
  status: 'Pending',
  startDate: '2026-06-01',
  endDate: '2026-06-30',
});

if (response.code === 1) {
  console.log('Pending claims in June:', response.data);
}
```

---

### `fetchOneClaim`

Retrieves a single claim by its UUID.

**Signature:**

```typescript
static async fetchOneClaim(claimId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter | Type     | Required | Description                            |
| --------- | -------- | -------- | -------------------------------------- |
| `claimId` | `string` | ✅ Yes    | A valid UUID of the claim to retrieve. |

**Response `data`:** A single claim object.

**Throws:**

- `"SDK Error: claim id is required"` — if `claimId` is missing.
- `"SDK Error: Invalid claim id"` — if `claimId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchOneClaim('claim-uuid-here');

if (response.code === 1) {
  console.log('Claim status:', response.data.status);
}
```

---

## Customers

### `fetchCustomers`

Retrieves a paginated, filterable list of customers.

**Signature:**

```typescript
static async fetchCustomers(options: {
  page?: number;
  limit?: number;
  isActive?: boolean;
  createdAtStart?: string;
  createdAtEnd?: string;
  search?: string;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter        | Type      | Required | Default | Description                                                  |
| ---------------- | --------- | -------- | ------- | ------------------------------------------------------------ |
| `page`           | `number`  | ❌ No     | `1`     | Page number.                                                 |
| `limit`          | `number`  | ❌ No     | `10`    | Results per page.                                            |
| `isActive`       | `boolean` | ❌ No     | —       | Filter by active (`true`) or inactive (`false`) customers.   |
| `createdAtStart` | `string`  | ❌ No     | —       | Filter customers created on or after this date (`yyyy-mm-dd`). |
| `createdAtEnd`   | `string`  | ❌ No     | —       | Filter customers created on or before this date (`yyyy-mm-dd`). |
| `search`         | `string`  | ❌ No     | —       | Free-text search by name, email, or other customer fields.   |

**Response `data`:** `Array` of customer objects.

**Response `meta`:** `{ page, limit, totalCount }`

**Throws:**

- `"SDK Error: Invalid date: ..."` — if `createdAtStart` or `createdAtEnd` is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await MyCoverAi.fetchCustomers({
  search: 'amara',
  isActive: true,
  createdAtStart: '2026-01-01',
});

if (response.code === 1) {
  console.log('Matching customers:', response.data);
}
```

---

### `fetchOneCustomer`

Retrieves a single customer by their UUID.

**Signature:**

```typescript
static async fetchOneCustomer(customerId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type     | Required | Description                               |
| ------------ | -------- | -------- | ----------------------------------------- |
| `customerId` | `string` | ✅ Yes    | A valid UUID of the customer to retrieve. |

**Response `data`:** A single customer object.

**Throws:**

- `"SDK Error: customer id is required"` — if `customerId` is missing.
- `"SDK Error: Invalid customer id"` — if `customerId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchOneCustomer('customer-uuid-here');

if (response.code === 1) {
  console.log('Customer email:', response.data.email);
}
```

---

### `fetchCustomerPurchases`

Retrieves all purchases made by a specific customer, with optional pagination and renewal filtering.

**Signature:**

```typescript
static async fetchCustomerPurchases(options: {
  customerId: string;
  page?: number;
  limit?: number;
  isRenewal?: boolean;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type      | Required | Default | Description                                                  |
| ------------ | --------- | -------- | ------- | ------------------------------------------------------------ |
| `customerId` | `string`  | ✅ Yes    | —       | A valid UUID of the customer.                                |
| `page`       | `number`  | ❌ No     | `1`     | Page number.                                                 |
| `limit`      | `number`  | ❌ No     | `10`    | Results per page.                                            |
| `isRenewal`  | `boolean` | ❌ No     | —       | If `true`, returns only renewed purchases. `false` for originals. |

**Response `data`:** `Array` of purchase objects for the customer.

**Response `meta`:** `{ page, limit, totalCount }`

**Throws:**

- `"SDK Error: customer id is required"` — if `customerId` is missing.
- `"SDK Error: Invalid customer id"` — if `customerId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchCustomerPurchases({
  customerId: 'customer-uuid-here',
  isRenewal: false,
  page: 1,
  limit: 5,
});

if (response.code === 1) {
  console.log('Customer purchases:', response.data);
}
```

---

### `fetchCustomerPolicies`

Retrieves all insurance policies belonging to a specific customer.

**Signature:**

```typescript
static async fetchCustomerPolicies(options: {
  customerId: string;
  page?: number;
  limit?: number;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type     | Required | Default | Description                   |
| ------------ | -------- | -------- | ------- | ----------------------------- |
| `customerId` | `string` | ✅ Yes    | —       | A valid UUID of the customer. |
| `page`       | `number` | ❌ No     | `1`     | Page number.                  |
| `limit`      | `number` | ❌ No     | `10`    | Results per page.             |

**Response `data`:** `Array` of policy objects for the customer.

**Response `meta`:** `{ page, limit, totalCount }`

**Throws:**

- `"SDK Error: customer id is required"` — if `customerId` is missing.
- `"SDK Error: Invalid customer id"` — if `customerId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchCustomerPolicies({
  customerId: 'customer-uuid-here',
});

if (response.code === 1) {
  console.log('Customer has', response.meta?.totalCount, 'policies');
}
```

---

## Purchases

### `fetchPurchases`

Retrieves a paginated, filterable list of all purchases across all customers.

**Signature:**

```typescript
static async fetchPurchases(options: {
  page?: number;
  limit?: number;
  search?: string;
  isRenewal?: boolean;
  createdAtStart?: string;
  createdAtEnd?: string;
}): Promise<IMcaResponse>
```

**Parameters:**

| Parameter        | Type      | Required | Default | Description                                                  |
| ---------------- | --------- | -------- | ------- | ------------------------------------------------------------ |
| `page`           | `number`  | ❌ No     | `1`     | Page number.                                                 |
| `limit`          | `number`  | ❌ No     | `10`    | Results per page.                                            |
| `search`         | `string`  | ❌ No     | —       | Free-text search across purchase fields.                     |
| `isRenewal`      | `boolean` | ❌ No     | —       | If `true`, returns only renewals. `false` for original purchases. |
| `createdAtStart` | `string`  | ❌ No     | —       | Filter purchases created on or after this date (`yyyy-mm-dd`). |
| `createdAtEnd`   | `string`  | ❌ No     | —       | Filter purchases created on or before this date (`yyyy-mm-dd`). |

**Response `data`:** `Array` of purchase objects.

**Response `meta`:** `{ page, limit, totalCount }`

**Throws:**

- `"SDK Error: Invalid date: ..."` — if `createdAtStart` or `createdAtEnd` is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await MyCoverAi.fetchPurchases({
  isRenewal: false,
  createdAtStart: '2026-01-01',
  createdAtEnd: '2026-03-31',
  limit: 25,
});

if (response.code === 1) {
  console.log('Q1 new purchases:', response.data.length);
}
```

---

### `fetchOnePurchase`

Retrieves a single purchase by its UUID. Internal fields (`dividend`, `renewal_history`) are automatically stripped from the response.

**Signature:**

```typescript
static async fetchOnePurchase(purchaseId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type     | Required | Description                               |
| ------------ | -------- | -------- | ----------------------------------------- |
| `purchaseId` | `string` | ✅ Yes    | A valid UUID of the purchase to retrieve. |

**Response `data`:** A single purchase object (internal fields stripped).

**Throws:**

- `"SDK Error: purchase id is required"` — if `purchaseId` is missing.
- `"SDK Error: Invalid purchase id"` — if `purchaseId` is not a valid UUID.

**Example:**

```typescript
const response = await MyCoverAi.fetchOnePurchase('purchase-uuid-here');

if (response.code === 1) {
  console.log('Purchase details:', response.data);
}
```

---

## Error Handling

The SDK has two layers of error handling:

### 1. Synchronous Validation Errors (thrown)

Methods that validate their inputs (IDs, dates) will **throw** a JavaScript `Error` synchronously if validation fails. These should be caught with `try/catch` or `.catch()`:

```typescript
try {
  // Throws: "SDK Error: Invalid product id"
  await MyCoverAi.fetchOneProduct('not-a-valid-uuid');
} catch (err) {
  console.error(err.message); // "SDK Error: Invalid product id"
}
```

All thrown errors follow the format: `"SDK Error: <description>"`.

### 2. API Errors (returned as `IMcaResponse`)

When an API request fails (e.g., 4xx / 5xx HTTP errors), the method **does not throw** — it returns an `IMcaResponse` with `code: 0`:

```typescript
const response = await MyCoverAi.buy(productId, form);

if (response.code === 0) {
  // e.g., "API Error: Unauthorized" or "API Error: Product not found"
  console.error('API error:', response.message);
}
```

API error messages follow the format: `"API Error: <description>"`.

### Recommended Pattern

```typescript
async function purchasePolicy() {
  try {
    const response = await MyCoverAi.buy(productId, buyForm);

    if (response.code === 1) {
      // ✅ Success
      return response.data;
    } else {
      // ⚠️ API-level failure
      throw new Error(response.message);
    }
  } catch (err) {
    // 🚫 SDK validation error OR network error
    console.error('Failed to purchase policy:', err.message);
  }
}
```

---

## Fluent API (Method Chaining)

The configuration methods (`setApiKey`, `setProducts`, `setCategory`) all return the `MyCoverAi` class itself, enabling a fluent, chainable initialization pattern:

```typescript
MyCoverAi
  .setApiKey('your-api-key')
  .setProducts([
    PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto,
    PRODUCTS_RECOMMENDED.AUTO.CoronationComprehensiveAuto,
  ])
  .setCategory([PRODUCT_CATEGORIES.Auto]);

// All subsequent fetchProducts() calls will be scoped to the above.
const response = await MyCoverAi.fetchProducts({ limit: 5 });
```

> **Important:** `setApiKey` should always be the first call. `setProducts` and `setCategory` only affect `fetchProducts` — they do not filter other endpoints like `fetchPolicies` or `fetchClaims`.

---

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](./LICENSE) file for the full text.

In short, you're free to use, modify, and distribute this SDK (including for commercial purposes), provided you retain the original copyright notice and license text. The Apache 2.0 License also includes an express grant of patent rights from contributors, and requires stating any significant changes made to the code.

### Contributing

This project is open to contributions! By submitting a pull request or contribution, you agree that your contribution will be licensed under the same Apache License 2.0 that covers the project. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.