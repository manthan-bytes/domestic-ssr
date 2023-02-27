import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable()
export class XMomentService {
  private timezones = {
    MDT: 'America/Denver',
    MST: 'America/Denver',
    PDT: 'America/Los_Angeles',
    PST: 'America/Los_Angeles',
    EDT: 'America/New_York',
    EST: 'America/New_York',
    CDT: 'America/Chicago',
    CST: 'America/Chicago',
    UTC: 'UTC',
  };
  constructor() {}

  defaultTime() {
    const today = moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
    return moment(today).utc();
  }

  defaultDate() {
    const today = moment.tz(moment().utc(false), 'America/Denver').startOf('day').format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
    return moment(today).utc();
  }

  defaultTimeWithTimezone(timezone) {
    const today = moment.tz(moment().utc(false), this.timezones[timezone]).format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
    return moment(today).utc();
  }

  convertDateIntoDefaultTime(date) {
    const today = moment.tz(moment(date), 'America/Denver');
    return moment(today).utc();
  }

  convertDateWithTimezone(timezone, date) {
    const today = moment.tz(moment(date), this.timezones[timezone] || 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
    return moment(today).utc();
  }

  convertDateTimeWithTimezone(timezone, date) {
    const today = moment.tz(moment(date), this.timezones[timezone] || 'America/Denver').format('YYYY-MM-DD') + 'T00:00:00.000Z';
    return moment(today).utc();
  }
  checInActivationDateFormat(date) {
    return moment.utc(date).subtract(7, 'hours');
  }
}
