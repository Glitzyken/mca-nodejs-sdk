# MyCover.ai Node.js SDK

> Seamlessly integrate Africa's foremost insure-tech infrastructure into your Node.js/Nest.js application.

[![npm version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://www.npmjs.com/package/mca-nodejs-sdk)
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

---

## What's New in v2.1.0

- **Asynchronous Purchase & Renewal Flow**: The SDK now accommodates MyCover.ai's asynchronous pattern on policy creation and renewals. The `buy` and `renew` methods automatically handle request initiation and polling behind the scenes, resolving directly with the completed policy object.
- **Wallet Balance**: Added `fetchWalletBalance` to query your MCA wallet balance across supported currencies (`NGN`, `USD`, `GHS`, `KES`, `XOF`).
- **Method Renaming**: Renamed `setCategory` to `setCategories` for setting category-level filters.

---

<!-- ============================================= -->
<!-- 2. TABLE OF CONTENTS -->
<!-- ============================================= -->

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [setProducts](#setproducts)
  - [setCategories](#setcategories)
- [Interfaces](#interfaces)
  - [IMcaResponse](#imcaresponse)
  - [IBuyForm](#ibuyform)
- [Exported Constants & Enums](#exported-constants--enums)
  - [PRODUCT_CATEGORY](#product_category)
  - [PRODUCTS_RECOMMENDED](#products_recommended)
  - [Currency](#currency)
  - [Country](#country)
- [Methods](#methods)
  - [Products](#products)
    - [fetchProducts](#fetchproducts)
    - [fetchOneProduct](#fetchoneproduct)
    - [fetchOneUtility](#fetchoneutility)
  - [Insurance Transactions](#insurance-transactions)
    - [calculatePremium](#calculatepremium)
    - [buy (Async Polled)](#buy)
    - [renew (Async Polled)](#renew)
  - [Wallets](#wallets)
    - [fetchWalletBalance](#fetchwalletbalance)
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
- [License](#license)

---

## Overview

The **MyCover.ai Node.js SDK** is an unofficial, developer-friendly TypeScript library that wraps the [MyCover.ai v2 REST API](https://docs.mycover.ai). It provides a clean, strongly-typed class instance for working with:

- **Products** — Browse and filter insurance products
- **Premiums** — Calculate insurance premiums before purchase
- **Purchases & Renewals** — Buy and renew insurance policies with built-in asynchronous request initialization and status polling
- **Wallets** — Fetch your MCA wallet balances across multiple supported currencies
- **Policies** — Manage and inspect active policies
- **Claims** — Track and retrieve insurance claims
- **Customers** — Manage customer records and view purchase/policy histories

> [!NOTE]
> **Asynchronous Buy & Renewal Pattern**: MyCover.ai uses an asynchronous initiation and status verification flow for purchases and renewals. This SDK seamlessly abstracts this complexity—methods like `buy()` and `renew()` initiate the transaction, poll the status endpoint in the background until completion, and return the final policy payload directly.

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
import MyCoverAi, { PRODUCT_CATEGORY, PRODUCTS_RECOMMENDED, Currency } from 'mca-nodejs-sdk';

// 1. Initialize with your API key
const mca = new MyCoverAi('your-api-key-here');

// 2. (Optional) Scope requests to specific products or categories
mca
  .setProducts([PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto])
  .setCategories([PRODUCT_CATEGORY.Auto]);

// 3. Fetch products
const response = await mca.fetchProducts({ page: 1, limit: 10 });

if (response.code === 1) {
  console.log('Products:', response.data);
  console.log('Total:', response.meta?.totalCount);
} else {
  console.error('Error:', response.message);
}

// 4. Check Wallet Balance
const walletRes = await mca.fetchWalletBalance(Currency.NGN);
if (walletRes.code === 1) {
  console.log('Wallet Balance:', walletRes.data);
}
```

---

## Configuration

These builder methods on the `MyCoverAi` instance customize the scope of subsequent product requests. They support **method chaining** and can be called on the instance.

---

### `setProducts`

Scopes subsequent `fetchProducts` calls to a specific list of product IDs. All product IDs must be valid UUIDs; validation fails and throws an error if any invalid UUID is passed.

**Signature:**

```typescript
setProducts(productIds: string[]): MyCoverAi
```

**Parameters:**

| Parameter    | Type       | Required | Description                                                  |
| ------------ | ---------- | -------- | ------------------------------------------------------------ |
| `productIds` | `string[]` | ✅ Yes    | An array of product UUIDs to filter by. Must have at least one. |

**Returns:** `MyCoverAi` — The instance itself, enabling method chaining.

**Throws:** `Error` if the array is empty, not provided, or contains invalid UUIDs (in which case it lists the invalid IDs).

> **Tip:** Use the exported `PRODUCTS_RECOMMENDED` constant to avoid hardcoding UUIDs.

**Example:**

```typescript
import { PRODUCTS_RECOMMENDED } from 'mca-nodejs-sdk';

mca.setProducts([
  PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto,
  PRODUCTS_RECOMMENDED.HEALTH.PrimeCare,
]);
```

---

### `setCategories`

Scopes subsequent `fetchProducts` calls to one or more insurance categories. All categories must be valid; validation fails and throws an error if any invalid category is passed.

**Signature:**

```typescript
setCategories(
  categories: (typeof PRODUCT_CATEGORY)[keyof typeof PRODUCT_CATEGORY][]
): MyCoverAi
```

**Parameters:**

| Parameter    | Type                   | Required | Description                                                 |
| ------------ | ---------------------- | -------- | ----------------------------------------------------------- |
| `categories` | `PRODUCT_CATEGORY[]` | ✅ Yes    | An array of category UUID values from `PRODUCT_CATEGORY`. |

**Returns:** `MyCoverAi` — The instance itself, enabling method chaining.

**Throws:** `Error` if the array is empty, not provided, or contains invalid categories.

**Example:**

```typescript
import { PRODUCT_CATEGORY } from 'mca-nodejs-sdk';

mca.setCategories([
  PRODUCT_CATEGORY.Auto,
  PRODUCT_CATEGORY.Health,
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
  data?: Record<string, any>;

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
| `code`    | `1 \| 0`              | `1` on success, `0` on API-level or validation failure.      |
| `message` | `string`              | A human-readable status message (e.g., `"Products fetched successfully"`). |
| `data`    | `Record<string, any>` | The primary response payload — an object or array depending on the endpoint. |
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

## Exported Constants & Enums

### `PRODUCT_CATEGORY`

A map of human-readable category names to their corresponding UUIDs on the MyCover.ai platform. Use these values with [`setCategories`](#setcategories) and [`fetchPolicies`](#fetchpolicies).

```typescript
import { PRODUCT_CATEGORY } from 'mca-nodejs-sdk';

// Available keys:
PRODUCT_CATEGORY.Package          // '14fb5968-48d2-49ac-88a8-0ee40e01fcca'
PRODUCT_CATEGORY.Gadget           // '1e87194d-5eb1-48b6-8837-a9cbc78d4ec3'
PRODUCT_CATEGORY['Agency Banking'] // '62d58862-38dd-4d9c-affc-95102e8fbc8b'
PRODUCT_CATEGORY.Life             // '704f6261-3710-48e5-a894-ffc4d6bdc381'
PRODUCT_CATEGORY['Credit Life']   // '814f6261-3710-48e5-a894-ffc4d6bdc381'
PRODUCT_CATEGORY.Auto             // '978ced0d-0e05-4de6-b43a-b408c0e8b95e'
PRODUCT_CATEGORY.Health           // '9d78bc79-3fa8-447d-b688-e42c1c6838a0'
PRODUCT_CATEGORY.Content          // '9e9d5fe0-2129-41a5-9f44-9c9fe90b3855'
PRODUCT_CATEGORY.Travel           // 'f3933c0d-ef7c-4287-90bd-744cf00c8426'
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

### `Currency`

An enum representing supported currencies for transactions and wallet balances.

```typescript
import { Currency } from 'mca-nodejs-sdk';

// Available currencies:
Currency.NGN // 'NGN' (Default)
Currency.USD // 'USD'
Currency.GHS // 'GHS'
Currency.KES // 'KES'
Currency.XOF // 'XOF'
```

---

### `Country`

An enum representing supported countries across the MyCover.ai infrastructure.

```typescript
import { Country } from 'mca-nodejs-sdk';

// Available countries:
Country.Nigeria      // 'Nigeria'
Country.Ghana        // 'Ghana'
Country.Kenya        // 'Kenya'
Country.IvoryCoast   // 'IvoryCoast'
Country.UnitedStates // 'UnitedStates'
```

---

## Methods

All methods are **instance methods** on a `MyCoverAi` instance. They are all `async` (returning `Promise<IMcaResponse>`) unless noted otherwise.

---

## Products

### `fetchProducts`

Retrieves a paginated list of insurance products. The results can be pre-filtered by calling [`setProducts`](#setproducts) and/or [`setCategories`](#setcategories) before calling this method.

**Signature:**

```typescript
async fetchProducts(options: {
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
const response = await mca.fetchProducts({ page: 1, limit: 20 });

if (response.code === 1) {
  const { data: products, meta } = response;
  console.log(`Showing ${products.length} of ${meta?.totalCount} products`);
}
```

---

### `fetchOneProduct`

Retrieves a single insurance product by its UUID.

**Signature:**

```typescript
async fetchOneProduct(productId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type     | Required | Description                              |
| ----------- | -------- | -------- | ---------------------------------------- |
| `productId` | `string` | ✅ Yes    | A valid UUID of the product to retrieve. |

**Response `data`:** A single product object.

**Throws / Fail Response:**

- `"SDK Error: product id is required"` — if `productId` is missing.
- `"SDK Error: Invalid product id"` — if `productId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchOneProduct(
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
async fetchOneUtility(utilityId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type     | Required | Description                              |
| ----------- | -------- | -------- | ---------------------------------------- |
| `utilityId` | `string` | ✅ Yes    | A valid UUID of the utility to retrieve. |

**Response `data`:** A utility object.

**Throws / Fail Response:**

- `"SDK Error: utility id is required"` — if `utilityId` is missing.
- `"SDK Error: Invalid utility id"` — if `utilityId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchOneUtility('some-utility-uuid');

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
async calculatePremium(
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

**Throws / Fail Response:**

- `"SDK Error: product id is required"` — if `productId` is missing.
- `"SDK Error: Invalid product id"` — if `productId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.calculatePremium(
  PRODUCTS_RECOMMENDED.AUTO.CoronationComprehensiveAuto,
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

Purchases an insurance policy for a customer.

> [!IMPORTANT]
> **Asynchronous Flow Abstraction**:
> MyCover.ai operates on an asynchronous request pattern for purchases. When `buy` is called:
> 1. It initiates the purchase with the endpoint (`/products/buy/initiate`) and receives a `request_id`.
> 2. It automatically polls the request status endpoint (`/products/requests/status/:id`) in the background at 500ms intervals (up to 30 attempts).
> 3. Once the status transitions to `completed`, it resolves with the resulting `policy` data object.
> 4. If the status transitions to `failed` or times out, it captures the error and returns a failure response cleanly.

**Signature:**

```typescript
async buy<T extends IBuyForm>(
  productId: string,
  form: T
): Promise<IMcaResponse>
```

**Parameters:**

| Parameter   | Type                 | Required | Description                                                  |
| ----------- | -------------------- | -------- | ------------------------------------------------------------ |
| `productId` | `string`             | ✅ Yes    | A valid UUID of the product to purchase.                     |
| `form`      | `T extends IBuyForm` | ✅ Yes    | Customer and product-specific details. See [`IBuyForm`](#ibuyform). |

**Response `data`:** A policy object containing policy details (e.g., `policy_number`, `id`, `status`).

**Throws / Fail Response:**

- `"SDK Error: product id is required"` — if `productId` is missing.
- `"SDK Error: Invalid product id"` — if `productId` is not a valid UUID.
- `"API Error: <failure_reason>"` — if the asynchronous purchase request fails.
- `"SDK Error: ⏰ Timed out waiting for completion"` — if polling exceeds maximum attempts.

**Example:**

```typescript
const response = await mca.buy(PRODUCTS_RECOMMENDED.LIFE.AccidentCover, {
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

> [!IMPORTANT]
> **Asynchronous Flow Abstraction**:
> Similar to `buy()`, `renew()` accommodates the MCA asynchronous renewal flow. It initiates the renewal request via `/products/renew/initiate/:id` and automatically polls `/products/requests/status/:id` until the renewal completes, returning the resulting policy payload.

**Signature:**

```typescript
async renew(
  policyId: string,
  payload: Record<string, any>
): Promise<IMcaResponse>
```

**Parameters:**

| Parameter  | Type                  | Required | Description                                                  |
| ---------- | --------------------- | -------- | ------------------------------------------------------------ |
| `policyId` | `string`              | ✅ Yes    | A valid UUID of the policy to renew.                         |
| `payload`  | `Record<string, any>` | ✅ Yes    | Renewal-specific data required by the product (can be an empty object). |

**Response `data`:** The renewed policy object.

**Throws / Fail Response:**

- `"SDK Error: policy id is required"` — if `policyId` is missing.
- `"SDK Error: Invalid policy id"` — if `policyId` is not a valid UUID.
- `"API Error: <failure_reason>"` — if the asynchronous renewal request fails.
- `"SDK Error: ⏰ Timed out waiting for completion"` — if polling exceeds maximum attempts.

**Example:**

```typescript
const response = await mca.renew('policy-uuid-here', {
  // product-specific renewal fields (if any)
});

if (response.code === 1) {
  console.log('Policy renewed:', response.data);
} else {
  console.error('Renewal failed:', response.message);
}
```

---

## Wallets

### `fetchWalletBalance`

Retrieves the wallet balance for your MyCover.ai account for a specified currency.

**Signature:**

```typescript
async fetchWalletBalance(
  currency: Currency = Currency.NGN
): Promise<IMcaResponse>
```

**Parameters:**

| Parameter  | Type       | Required | Default        | Description                                                  |
| ---------- | ---------- | -------- | -------------- | ------------------------------------------------------------ |
| `currency` | `Currency` | ❌ No     | `Currency.NGN` | The currency to fetch the balance for (`NGN`, `USD`, `GHS`, `KES`, `XOF`). |

**Response `data`:** An object containing the wallet balance details.

**Throws / Fail Response:**

- `"SDK Error: Invalid currency"` — if an unrecognized currency is provided.

**Example:**

```typescript
import { Currency } from 'mca-nodejs-sdk';

// Fetch NGN balance (default)
const ngnWallet = await mca.fetchWalletBalance();
if (ngnWallet.code === 1) {
  console.log('NGN Balance:', ngnWallet.data);
}

// Fetch USD balance
const usdWallet = await mca.fetchWalletBalance(Currency.USD);
if (usdWallet.code === 1) {
  console.log('USD Balance:', usdWallet.data);
}
```

---

## Policies

### `fetchPolicies`

Retrieves a paginated, filterable list of insurance policies.

**Signature:**

```typescript
async fetchPolicies(options: {
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

**Throws / Fail Response:**

- `"SDK Error: Invalid product id"` — if `productId` is provided but not a valid UUID.
- `"SDK Error: Invalid date: ..."` — if any date filter is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await mca.fetchPolicies({
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
async fetchOnePolicy(policyId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter  | Type     | Required | Description                             |
| ---------- | -------- | -------- | --------------------------------------- |
| `policyId` | `string` | ✅ Yes    | A valid UUID of the policy to retrieve. |

**Response `data`:** A single policy object.

**Throws / Fail Response:**

- `"SDK Error: policy id is required"` — if `policyId` is missing.
- `"SDK Error: Invalid policy id"` — if `policyId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchOnePolicy('policy-uuid-here');

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
async fetchClaims(options: {
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

**Throws / Fail Response:**

- `"SDK Error: Invalid customer id"` — if `customerId` is provided but not a valid UUID.
- `"SDK Error: Invalid date: ..."` — if `startDate` or `endDate` is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await mca.fetchClaims({
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
async fetchOneClaim(claimId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter | Type     | Required | Description                            |
| --------- | -------- | -------- | -------------------------------------- |
| `claimId` | `string` | ✅ Yes    | A valid UUID of the claim to retrieve. |

**Response `data`:** A single claim object.

**Throws / Fail Response:**

- `"SDK Error: claim id is required"` — if `claimId` is missing.
- `"SDK Error: Invalid claim id"` — if `claimId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchOneClaim('claim-uuid-here');

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
async fetchCustomers(options: {
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

**Throws / Fail Response:**

- `"SDK Error: Invalid date: ..."` — if `createdAtStart` or `createdAtEnd` is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await mca.fetchCustomers({
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
async fetchOneCustomer(customerId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type     | Required | Description                               |
| ------------ | -------- | -------- | ----------------------------------------- |
| `customerId` | `string` | ✅ Yes    | A valid UUID of the customer to retrieve. |

**Response `data`:** A single customer object.

**Throws / Fail Response:**

- `"SDK Error: customer id is required"` — if `customerId` is missing.
- `"SDK Error: Invalid customer id"` — if `customerId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchOneCustomer('customer-uuid-here');

if (response.code === 1) {
  console.log('Customer email:', response.data.email);
}
```

---

### `fetchCustomerPurchases`

Retrieves all purchases made by a specific customer, with optional pagination and renewal filtering.

**Signature:**

```typescript
async fetchCustomerPurchases(options: {
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

**Throws / Fail Response:**

- `"SDK Error: customer id is required"` — if `customerId` is missing.
- `"SDK Error: Invalid customer id"` — if `customerId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchCustomerPurchases({
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
async fetchCustomerPolicies(options: {
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

**Throws / Fail Response:**

- `"SDK Error: customer id is required"` — if `customerId` is missing.
- `"SDK Error: Invalid customer id"` — if `customerId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchCustomerPolicies({
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
async fetchPurchases(options: {
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

**Throws / Fail Response:**

- `"SDK Error: Invalid date: ..."` — if `createdAtStart` or `createdAtEnd` is not in `yyyy-mm-dd` format.

**Example:**

```typescript
const response = await mca.fetchPurchases({
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

Retrieves a single purchase by its UUID.

**Signature:**

```typescript
async fetchOnePurchase(purchaseId: string): Promise<IMcaResponse>
```

**Parameters:**

| Parameter    | Type     | Required | Description                               |
| ------------ | -------- | -------- | ----------------------------------------- |
| `purchaseId` | `string` | ✅ Yes    | A valid UUID of the purchase to retrieve. |

**Response `data`:** A single purchase object.

**Throws / Fail Response:**

- `"SDK Error: purchase id is required"` — if `purchaseId` is missing.
- `"SDK Error: Invalid purchase id"` — if `purchaseId` is not a valid UUID.

**Example:**

```typescript
const response = await mca.fetchOnePurchase('purchase-uuid-here');

if (response.code === 1) {
  console.log('Purchase details:', response.data);
}
```

---

## Error Handling

The SDK provides a consistent and unified error handling paradigm. All asynchronous API methods catch internal validation errors (such as invalid UUIDs or incorrect dates) and network/API failures, returning them inside the `IMcaResponse` payload with `code: 0`.

### 1. API & Validation Errors (returned as `IMcaResponse`)

Asynchronous API methods do not throw unhandled exceptions. If validation fails or an API request fails, the method resolves to an `IMcaResponse` with `code: 0`:

```typescript
const response = await mca.fetchOneProduct('not-a-valid-uuid');

if (response.code === 0) {
  // e.g., "SDK Error: Invalid product id"
  console.error('Error:', response.message);
}
```

- Validation error messages follow the format: `"SDK Error: <description>"`.
- API error messages follow the format: `"API Error: <description>"`.

### 2. Synchronous Validation Errors (thrown)

The constructor and builder methods (`setProducts`, `setCategories`) run synchronously and will **throw** a JavaScript `Error` if their parameters are missing or invalid:

```typescript
try {
  // Throws: "SDK Error: API Key is required"
  const mca = new MyCoverAi('');
} catch (err) {
  console.error(err.message);
}

try {
  // Throws: "SDK Error: Invalid product ID(s): not-a-valid-uuid"
  mca.setProducts(['not-a-valid-uuid']);
} catch (err) {
  console.error(err.message);
}
```

---

## Fluent API (Method Chaining)

The configuration methods (`setProducts`, `setCategories`) return the `MyCoverAi` instance itself, enabling a fluent, chainable configuration pattern upon initialization:

```typescript
const mca = new MyCoverAi('your-api-key')
  .setProducts([
    PRODUCTS_RECOMMENDED.AUTO.ThirdPartyAuto,
    PRODUCTS_RECOMMENDED.AUTO.CoronationComprehensiveAuto,
  ])
  .setCategories([PRODUCT_CATEGORY.Auto]);

// All subsequent fetchProducts() calls will be scoped to the above.
const response = await mca.fetchProducts({ limit: 5 });
```

> **Important:** `setProducts` and `setCategories` only affect `fetchProducts` — they do not filter other endpoints like `fetchPolicies` or `fetchClaims`.

---

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](./LICENSE) file for the full text.

In short, you're free to use, modify, and distribute this SDK (including for commercial purposes), provided you retain the original copyright notice and license text. The Apache 2.0 License also includes an express grant of patent rights from contributors, and requires stating any significant changes made to the code.

### Contributing

This project is open to contributions! By submitting a pull request or contribution, you agree that your contribution will be licensed under the same Apache License 2.0 that covers the project. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.