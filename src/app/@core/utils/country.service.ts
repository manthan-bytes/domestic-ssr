import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICountry, ICountryState } from '@core/interfaces/common.interface';

@Injectable()
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountries() {
    let url = `assets/json/countries.json`;
    url = encodeURI(url);
    return this.http.get<ICountry[]>(url);
  }

  getStates(country: ICountry) {
    let url = `assets/json/regions/${country.regionFile}.json`;
    url = encodeURI(url);
    return this.http.get<ICountryState[]>(url);
  }
}
