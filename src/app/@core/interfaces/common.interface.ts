export interface ICountry {
  name: string;
  value: string;
  regionFile: string;
}

export interface ICountryState {
  name: string;
  value: string;
}

export interface ImageCropData {
  imageData: string;
}

export interface ToastMsgOption {
  classname: string;
  delay: number;
}

export interface ForgotPassword {
  msg: string;
}
