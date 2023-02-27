import { Injectable } from '@angular/core';
import { localStorageConstant } from './var.constant.service';
@Injectable()
export class LocalStorageService {
  constructor() {}

  set(key: string, data: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key: string) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      console.error('Error getting data from localStorage', e);
      return null;
    }
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  flushAll() {
    this.remove(localStorageConstant.profilesUser);
    this.remove(localStorageConstant.redirectTo);
    this.remove(localStorageConstant.jwtToken);
    this.remove('challengeTeamId');
    // this.remove(localStorageConstant.virtualChallengeGreetinModal);
  }

  saveUser(data) {
    this.set(localStorageConstant.profilesUser, { data });
  }

  saveJwtToken(jwtToken) {
    localStorage.setItem(localStorageConstant.jwtToken, jwtToken);
  }

  getUser() {
    if (this.get(localStorageConstant.profilesUser)) {
      const profileUser = this.get(localStorageConstant.profilesUser).data;
      profileUser.fullName = profileUser.fullName ? profileUser.fullName : `${profileUser.firstName} ${profileUser.lastName}`;
      return profileUser;
    } else {
      return null;
    }
  }

  getToken() {
    if (localStorage.getItem(localStorageConstant.jwtToken)) {
      return localStorage.getItem(localStorageConstant.jwtToken);
    }
    return false;
  }
}
