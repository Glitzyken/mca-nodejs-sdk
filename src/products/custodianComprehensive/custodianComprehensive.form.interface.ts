interface CustodianComprehensiveForm {
  /** This is the brand of the vehicle */
  vehicle_make: string;
  /** This is the vehicle's model */
  vehicle_model: string;
  /** Customer's physical address */
  address: string;
  /** This is the date your customer wants the plan to begin */
  insurance_start_date: string;
  /** Customer's vehicle registration number */
  vehicle_registration_number: string;
  /** Customer's vehicle engine number */
  engine_number: string;
  /** Customer's vehicle chassis number */
  chassis_number: string;
  /** The year customer's vehicle was manufactured */
  vehicle_year_manufactured: string;
  /** This the type of customer's vehicle */
  vehicle_type: string;
  /** Colour of customer's vehicle */
  vehicle_color: string;
  /** This is the type of insurance coverage the customer wants */
  vehicle_insurance_type: string;
  /** This is the cost of the customer's vehicle */
  vehicle_value: number;
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
  /** This is the ID of the insurance plan */
  product_id: string;
}

export default CustodianComprehensiveForm;
