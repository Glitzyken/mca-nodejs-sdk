import MyCoverGeniusFlexiCareForm from '../myCoverGeniusFlexiCare/myCoverGeniusFlexiCare.form.interface';
import WellaHealthMalariaCoverForm from '../wellaHealthMalariaCover/wellaHealthMalariaCover.form.interface';

export type Form = MyCoverGeniusFlexiCareForm | WellaHealthMalariaCoverForm;

export type MCAResponse = {
  responseCode: number;
  responseText: string;
  statusCode: number;
  statusText?: string;
  message?: string;
  data?: any;
};
