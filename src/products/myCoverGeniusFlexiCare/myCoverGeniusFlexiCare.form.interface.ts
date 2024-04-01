interface MyCoverGeniusFlexiCareForm {
  /** Customer's legal first name */
  first_name: string;
  /** Customer's legal last name */
  last_name: string;
  /** Customer's email address */
  email: string;
  /** Customer's date of birth as it appears on legal documents */
  dob: string;
  /** Customer's phone number */
  phone: string;
  /** Customer's gender: Male | Female */
  gender: string;
  /** Number of months for this plan */
  payment_plan: number;
  /** URL of uploaded passport */
  image_url: string;
  /** This is the ID of the insurance plan */
  product_id: string;
}

export default MyCoverGeniusFlexiCareForm;
