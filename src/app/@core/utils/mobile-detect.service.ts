import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectionService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  isAndroid() {
    if (isPlatformBrowser(this.platformId)) {
      return navigator.userAgent.match(/Android/i);
    } else {
      return false; // Return a default value when running on the server side
    }
  }

  isBlackBerry() {
    if (isPlatformBrowser(this.platformId)) {
      return navigator.userAgent.match(/BlackBerry/i);
    } else {
      return false; // Return a default value when running on the server side
    }
  }

  isiOS() {
    if (isPlatformBrowser(this.platformId)) {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    } else {
      return false; // Return a default value when running on the server side
    }
  }

  isOpera() {
    if (isPlatformBrowser(this.platformId)) {
      return navigator.userAgent.match(/Opera Mini/i);
    } else {
      return false; // Return a default value when running on the server side
    }
  }

  isWindows() {
    if (isPlatformBrowser(this.platformId)) {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    } else {
      return false; // Return a default value when running on the server side
    }
  }

  isAnyMobile() {
    return (
      this.isAndroid() ||
      this.isBlackBerry() ||
      this.isiOS() ||
      this.isOpera() ||
      this.isWindows()
    );
  }

}