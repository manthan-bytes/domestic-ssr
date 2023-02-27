import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { RCMSEventDataService } from '../rcms-services/rcms-event.service';
import { UserInfo } from '../../interfaces/auth.interface';
import { ForgotPassword } from '../../interfaces/common.interface';
import { LocalStorageService, authRoutes } from '../../utils';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthDataService {
  private requestOptions = {
    headers: new HttpHeaders({ 'x-api-key': environment.RCMS_EVENT_API.KEY }),
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
    private rcmsEventDataService: RCMSEventDataService,
  ) {}

  login(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/login`;
    url = encodeURI(url);
    return this.http.post<UserInfo>(url, data, this.requestOptions);
  }

  createUser(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/apiCreateUser`;
    url = encodeURI(url);
    return this.http.post<UserInfo>(url, data, this.requestOptions);
  }

  forgotPassowrd(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/recoverPassword`;
    url = encodeURI(url);
    return this.http.post<ForgotPassword>(url, data, this.requestOptions);
  }

  updatePartialUser(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/updatePartialUser`;
    url = encodeURI(url);
    return this.http.post(url, data, this.requestOptions);
  }

  logOut() {
    this.localStorageService.flushAll();
    this.rcmsEventDataService.clearUserEventCache();
    this.router.navigate([`/${authRoutes.main}/${authRoutes.login}`]);
  }

  updateUser(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/updateUser`;
    url = encodeURI(url);
    return this.http.post<UserInfo>(url, data, this.requestOptions);
  }

  uploadProfilePhoto(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/uploadProfilePhoto`;
    url = encodeURI(url);
    return this.http.post<UserInfo>(url, data, this.requestOptions);
  }

  changePassword(data) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/changePassword`;
    url = encodeURI(url);
    return this.http.post<string>(url, data, this.requestOptions);
  }

  confirmPassword(data: { email: string; verificationCode: string; newPassword?: string }) {
    let url = `${environment.RCMS_EVENT_API.PROFILES_API}/confirmPassword`;
    url = encodeURI(url);
    return this.http.post<string>(url, data, this.requestOptions);
  }
}
