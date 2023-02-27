import { Injectable } from '@angular/core';
import { sessionStorageConstant } from './var.constant.service';
@Injectable()
export class SessionStorageService {
  constructor() {}

  public static REDIRECT_URL_KEY_NAME = 'redirectUrl';

  set(key: string, data: unknown): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(sessionStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  remove(key: string) {
    sessionStorage.removeItem(key);
  }

  flushAll() {
    this.remove(sessionStorageConstant.virtualChallengeSelectedPlan);
    this.remove(sessionStorageConstant.virtualChallengeInfo);
    this.remove(sessionStorageConstant.userStateService);
    this.remove(sessionStorageConstant.userInfo);
  }
}
