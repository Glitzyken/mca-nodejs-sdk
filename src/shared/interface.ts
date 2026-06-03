export interface IMcaResponse {
  code: number;
  message: string;
  data?: any;
  meta?: Record<string, any>;
}

export interface IApiResponse {
  responseCode: number;
  responseText: string;
  data?: any;
}

export interface IBuyForm {
  /** Customer's legal first name */
  first_name: string;
  /** Customer's legal last name */
  last_name: string;
  /** Customer's email address */
  email: string;
  /** Customer's date of birth as it appears on legal documents */
  date_of_birth: string;
  /** Customer's phone number */
  phone_number: string;
  /** Customer's gender: Male | Female */
  gender: 'Male' | 'Female';
  /** Customer's home address */
  address: string;
  /** Determine if the insurance is bought for self or other */
  bought_for_self: boolean;

  /** National Identity Number (NIN) of the customer */
  nin?: string;

  // Allow any additional fields of any type
  [key: string]: any;
}
