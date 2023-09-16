interface WellaHealthMalariaCoverForm {
  /** Customer's date of birth */
  date_of_birth: string;
  /** Male or Female */
  gender: string;
  /** Customer's home address */
  address: string;
  /** Passport image url */
  image_url: string;
  /** If the customer is adding additional beneficiaries to the policy. This field is optional. */
  beneficiaries?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    date_of_birth: string;
    gender: string;
  }[];
  /** The total number of beneficiaries set by the customer. The maximum is 5. This field is dependent on the "beneficiaries" field. */
  number_of_beneficiaries?: number;
  /** Customer's first name */
  first_name: string;
  /** Customer's last name */
  last_name: string;
  /** Customer's email */
  email: string;
  /** Customer's phone number */
  phone_number: string;
  /** Set a payment plan. Available options are Monthly, Quarterly, Bianually, Yearly */
  payment_plan: string;
  /** ID of product */
  product_id: string;
}

export default WellaHealthMalariaCoverForm;
