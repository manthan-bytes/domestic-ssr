import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as Bowser from 'bowser';
import { LocalStorageService } from './local-storage.service';
import { isPlatformBrowser } from '@angular/common';


@Injectable({ providedIn: 'root' })
export class DataLayerService {
  public formStatus = {
    SUCCESS: 'success',
    FAILED: 'failed',
  };
  constructor(private localStorageService: LocalStorageService, @Inject(PLATFORM_ID) private platformId: any,) { }
  pageInitEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'pageInit',
        screen_name: obj.screen_name || '', // the page name what the user see, especcially important when the ulr doesnt changes
        visitorLoginState: this.localStorageService.getUser() ? 'logged-in' : 'logged-out',
        user_id: this.localStorageService.getUser()?.id || '',
        visitorType: 'visitor' + (this.localStorageService.getUser() ? 'logged-in' : 'logged-out'),
        visitorEmail: this.localStorageService.getUser()?.emailAddress || '',
        visitorEmailHash: obj.visitorEmailHash || '',
        pagePostType: obj.pagePostType || '',
        pagePostType2: obj.pagePostType2 || '',
        browserName: Bowser.name,
        browserVersion: Bowser.version,
        browserEngineName: Bowser.blink
          ? 'blink'
          : Bowser.msie
            ? 'msie'
            : Bowser.gecko
              ? 'gecko'
              : Bowser.msedge
                ? 'msedge'
                : Bowser.webkit
                  ? 'webkit'
                  : '',
        browserEngineVersion: '',
        osName: Bowser.osname,
        osVersion: Bowser.osversion,
        deviceType: Bowser.ipad
          ? 'ipad'
          : Bowser.iphone
            ? 'iphone'
            : Bowser.mobile
              ? 'mobile'
              : Bowser.tablet
                ? 'tablet'
                : Bowser.ipod
                  ? 'iphod'
                  : 'desktop',
        deviceManufacturer: '',
        deviceModel: '',
        customerTotalOrders: 0,
        customerTotalOrderValue: '0.00',
        customerFirstName: '',
        customerLastName: '',
        customerBillingFirstName: '',
        customerBillingLastName: '',
        customerBillingCompany: '',
        customerBillingAddress1: '',
        customerBillingAddress2: '',
        customerBillingCity: '',
        customerBillingPostcode: '',
        customerBillingCountry: '',
        customerBillingEmail: '',
        customerBillingEmailHash: obj.customerBillingEmailHash || '',
        customerBillingPhone: '',
        customerShippingFirstName: '',
        customerShippingLastName: '',
        customerShippingCompany: '',
        customerShippingAddress1: '',
        customerShippingAddress2: '',
        customerShippingCity: '',
        customerShippingPostcode: '',
        customerShippingCountry: '',
      });
    }
  }
  formSubmitEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'formSubmitRagnar',
        ...obj,
      });
    }
  }
  inputFocusEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'formElementEnter',
        ...obj,
      });
    }
  }
  inputBlurEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'formElementExit',
        ...obj,
      });
    }
  }
  siteMessageEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'siteMessage',
        ...obj,
      });
    }
  }
  eCommerceSelectItemEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'select_item',
        ecommerce: {
          items: [{ ...obj }],
        },
      });
    }
  }
  eCommerceViewItemEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'view_item',
        ecommerce: {
          items: [{ ...obj }],
        },
      });
    }
  }
  eCommerceAddToCartItemEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'add_to_cart',
        ecommerce: {
          items: [{ ...obj }],
        },
      });
    }
  }
  eCommerceCheckoutEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'begin_checkout',
        ...obj,
      });
    }
  }
  eCommerceShippingInfoEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'add_shipping_info',
        ecommerce: {
          items: [{ ...obj }],
        },
      });
    }
  }
  eCommercePaymentInfoEvent(obj) {
    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'add_payment_info',
        ecommerce: {
          items: [{ ...obj }],
        },
      });
    }
  }
  eCommercePurchaseEvent(obj, purchaseObj) {

    if (isPlatformBrowser(this.platformId)) {
      // tslint:disable-next-line: no-string-literal
      window['dataLayer'].push({
        event: 'purchase',
        ...purchaseObj,
        ecommerce: {
          items: [{ ...obj }],
        },
      });
    }
  }
}
