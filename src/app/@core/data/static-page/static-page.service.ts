import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { RoadPartners } from '../../interfaces/road-partner.interface';
import { BannersListNew, Testimonials } from '../../interfaces/static-pages.interface';
@Injectable({
  providedIn: 'root',
})
export class StaticPageService {
  constructor(private http: HttpClient) {}

  supportPartnerFormData(data) {
    let url = `${environment.CMS_API}/partner-support`;
    url = encodeURI(url);
    return this.http.post<unknown>(url, data);
  }

  getSupportPartners() {
    let url = `${environment.CMS_API}/api/sponsor/list`;
    url = encodeURI(url);
    return this.http.get<RoadPartners[]>(url).pipe(
      map(
        (partnerData) => {
          (partnerData || []).filter((partner) => partner.logo_white);
          return partnerData || [];
        },
        (error) => {
          return error;
        },
      ),
    );
  }

  getBannersAndQuotes() {
    let url = `${environment.CMS_API}/api/banners_quotes/list`;
    url = encodeURI(url);
    return this.http.get<{ banners: BannersListNew[]; quotes: Testimonials[] }>(url).pipe(
      map(
        (bannersData) => {
          return bannersData;
        },
        (error) => {
          return error;
        },
      ),
    );
  }
}
