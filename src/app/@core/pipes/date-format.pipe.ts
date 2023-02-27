import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  constructor() {}
  transform(date: string, format: string, isEpoch: boolean = false): string {
    if (isEpoch) {
      return moment.utc(parseInt(date, 10)).format(format);
    } else {
      return moment.utc(date).format(format);
    }
  }
}

@Pipe({ name: 'timeFormat' })
export class TimeFormatPipe implements PipeTransform {
  constructor() {}
  transform(input, format?: string): string {
    if (input instanceof Date) {
      input = input.valueOf() / 1000;
    }
    if (typeof input === 'number') {
      input = input.toString();
    }

    const seconds = parseInt(input, 10);
    return isNaN(seconds)
      ? ''
      : moment(seconds * 1000)
          .utc()
          .format(format || 'hh:mm A');
  }
}

@Pipe({ name: 'dateRange' })
export class DateRangeFormatPipe implements PipeTransform {
  constructor() {}
  transform(dates): string {
    const startDate = moment(dates[0]).utc();
    const endDate = moment(dates[1]).utc();
    let format = ['MMM DD, YYYY', 'MMM DD, YYYY'];
    const withTime = dates.length === 4;
    format = withTime ? ['MMMM DD, YYYY hh:mm A', 'MMMM DD, YYYY hh:mm A'] : ['MMMM DD, YYYY', 'MMMM DD, YYYY'];

    if (!dates[0] || !dates[1] || !startDate.isValid() || !endDate.isValid()) {
      return '';
    }

    if (withTime) {
      startDate.add(dates[2], 'seconds');
      endDate.add(dates[3], 'seconds');
    }

    if (startDate.year() === endDate.year()) {
      format = withTime ? ['MMMM DD hh:mm A', 'MMMM DD, YYYY hh:mm A'] : ['MMMM DD', 'MMMM DD, YYYY'];

      if (startDate.month() === endDate.month()) {
        format = withTime ? ['MMMM DD hh:mm A', 'DD, YYYY hh:mm A'] : ['MMMM DD', 'DD, YYYY'];

        if (startDate.date() === endDate.date()) {
          format = ['MMM DD, YYYY hh:mm A', 'hh:mm A'];
          if (withTime) {
            if (startDate.valueOf() === endDate.valueOf()) {
              return startDate.format('MMMM DD, YYYY hh:mm A');
            }
          } else {
            return startDate.format('MMMM DD, YYYY');
          }
        }
      }
    }
    return [startDate.format(format[0]), endDate.format(format[1])].join(' - ');
  }
}
