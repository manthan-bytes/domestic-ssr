import { Pipe, PipeTransform } from '@angular/core';
import { RoadPartners } from '../interfaces/road-partner.interface';

@Pipe({
  name: 'roadPartner',
})
export class RoadPartnerPipe implements PipeTransform {
  transform(data: RoadPartners[], isRoad: boolean, isOfficial: boolean): RoadPartners[] | null {
    if (data) {
      if (isRoad) {
        if (isOfficial) {
          data = data.filter((f) => f.relay_official === '1' || f.relay_official);
        } else {
          data = data.filter((f) => f.relay_supporting === '1' || f.relay_supporting);
        }
      } else {
        if (isOfficial) {
          data = data.filter((f) => f.trail_official === '1' || f.trail_official);
        } else {
          data = data.filter((f) => f.trail_supporting === '1' || f.trail_supporting);
        }
      }
    }
    return data;
  }
}
