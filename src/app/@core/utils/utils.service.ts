import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
  constructor() {}

  removeBrandNameFromRaceName(raceName: string) {
    raceName = raceName
      .replace('Reebok', '')
      .replace('Ragnar', '')
      .replace('Trail', '')
      .replace('Road', '')
      .replace('Sunset', '')
      .replace('Sprint', '')
      .trim();
    return raceName;
  }
}
