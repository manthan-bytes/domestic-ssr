import { Injectable } from '@angular/core';

@Injectable()
export class MobileDetectionService {
  constructor() {}

  static isAndroid() {
    return navigator.userAgent.match(/Android/i);
  }

  static isBlackBerry() {
    return navigator.userAgent.match(/BlackBerry/i);
  }

  static isiOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  }

  static isOpera() {
    return navigator.userAgent.match(/Opera Mini/i);
  }

  static isWindows() {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  }

  static isAnyMobile() {
    return (
      MobileDetectionService.isAndroid() ||
      MobileDetectionService.isBlackBerry() ||
      MobileDetectionService.isiOS() ||
      MobileDetectionService.isOpera() ||
      MobileDetectionService.isWindows()
    );
  }
}
