import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UserInfo } from '../../interfaces/auth.interface';
import { LocalStorageService } from '../../utils';

@Injectable()
export class ProfileRcmsDataService {
  private requestOptions;
  private API_URL = environment.RCMS_EVENT_API.PROFILES_API;
  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    this.requestOptions = {
      headers: new HttpHeaders({ 'x-api-key': environment.RCMS_EVENT_API.KEY, Authorization: this.localStorageService.getToken() || null }),
    };
  }

  getUsersProfileImage(runnerIds) {
    let url = `${this.API_URL}/getUsersProfileImage`;
    url = encodeURI(url);
    return this.http.post<UserInfo[]>(url, runnerIds, this.requestOptions);
  }
}
