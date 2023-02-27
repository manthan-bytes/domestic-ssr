import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { MeetupCalenderList } from '../interfaces/static-pages.interface';
@Pipe({
  name: 'filterMeetupCalendar',
})
export class FilterMeetupCalendarPipe implements PipeTransform {
  transform(race: Array<MeetupCalenderList>, raceName: string, location: string, date: string): MeetupCalenderList[] {
    if (raceName) {
      race = (race || []).filter((obj) => obj.name.includes(raceName));
    }

    if (location) {
      race = (race || []).filter((obj) => `${obj.city} - ${obj.state} - ${obj.zip}`.includes(location));
    }
    if (date) {
      race = (race || []).filter(
        (obj) => obj.date >= moment(date.split('-')[0]).format('YYYY-MM-DD') && obj.date <= moment(date.split('-')[1]).format('YYYY-MM-DD'),
      );
    }
    return race;
  }
}
