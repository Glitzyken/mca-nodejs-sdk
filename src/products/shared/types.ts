import WellaHealthMalariaCoverForm from "../wellaHealthMalariaCover/wellaHealthMalariaCover.form.interface";
import CustodianComprehensiveForm from "../custodianComprehensive/custodianComprehensive.form.interface";

export type Form = WellaHealthMalariaCoverForm | CustodianComprehensiveForm;

export type MCAResponse = {
  responseCode: number;
  responseText: string;
  statusCode: number;
  statusText?: string;
  message?: string;
  data?: any;
};
