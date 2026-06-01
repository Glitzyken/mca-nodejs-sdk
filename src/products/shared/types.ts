import MyCoverGeniusFlexiCareForm from '../myCoverGeniusFlexiCare/myCoverGeniusFlexiCare.form.interface';
import WellaHealthMalariaCoverForm from '../wellaHealthMalariaCover/wellaHealthMalariaCover.form.interface';

export type Form = MyCoverGeniusFlexiCareForm | WellaHealthMalariaCoverForm;

export type McaResponse = {
  responseCode: number;
  statusCode: number;
  message: string;
  data?: any;
};

export type ApiResponse = {
  responseCode: number;
  responseText: string;
  data?: any;
};
