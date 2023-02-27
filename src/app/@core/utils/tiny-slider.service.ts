import { Injectable } from '@angular/core';

declare global {
  interface Window {
    tns(options): void;
  }
}

const windowRef = () => {
  return window.tns;
};

@Injectable({
  providedIn: 'root',
})
export class TinySliderService {
  constructor() {}

  get nativeSlider() {
    const tns = windowRef();
    return tns;
  }
}
