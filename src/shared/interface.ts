export interface IMcaResponse {
  code: number;
  message: string;
  data?: any;
}

export interface IApiResponse {
  responseCode: number;
  responseText: string;
  data?: any;
}

export interface IRequiredBuyForm {
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

  /** National Identity Number (NIN) of the customer */
  nin?: string;
}
