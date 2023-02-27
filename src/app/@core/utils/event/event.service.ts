import { Injectable } from '@angular/core';
import { MapCourseData } from '@core/interfaces/course-data.interface';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import * as moment from 'moment-timezone';
import { XMomentService } from '../xMoment.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  public includesId: Array<string> = ['107'];
  public excludesId: Array<string> = ['98', '103', '107'];
  public covid19Id: Array<string> = ['74', '36'];
  public remainsToOpenRegs = {
    days: null,
    hours: null,
    minutes: null,
  };
  constructor(private xMomentService: XMomentService) {}

  getStatus(event) {
    let status = 'REGISTER';
    // tslint:disable-next-line: one-variable-per-declaration
    const today = moment(),
      registrationOpens = event.early_open ? moment(event.early_open + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss') : undefined,
      registrationCloses = event.registration_closes ? moment(event.registration_closes + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss') : undefined;

    /* Deprecated Code */
    /* if ((event.reg_system && event.reg_system.percentageFull === '100') || event.percentageFull === '100') {
      if (event.waitlist_flag === '1') {
        status = 'WAIT_LIST';
      } else if (event.prelaunch_flag === '1') {
        status = 'PRELAUNCH';
      } else {
        status = 'FULL';
      }
    } */
    if (event.coming_soon === true) {
      status = 'COMING_SOON';
    }

    if (registrationCloses && today > registrationCloses) {
      status = 'SOLD_OUT';
    }

    if (registrationOpens && registrationOpens > today) {
      status = 'NOT_OPEN_YET';
    }

    if (event.prelaunch_flag === '1') {
      status = 'PRELAUNCH';
    }

    if (event.waitlist_flag === true) {
      status = 'WAIT_LIST';
    }

    if (event.lottery_flag === '1') {
      status = 'LOTTERY';
    }

    return status;
  }

  getRegStatusLabel(status) {
    const labels = {
      REGISTER: 'REGISTER',
      WAIT_LIST: 'WAIT LIST',
      FULL: 'FULL',
      NOT_OPEN_YET: 'CLOSED',
      SOLD_OUT: 'SOLD OUT',
      COMING_SOON: 'COMING SOON',
      LOTTERY: 'LOTTERY',
      PRELAUNCH: 'NOTIFY ME',
    };
    return labels[status];
  }

  getStatusMsg(event) {
    let statusMsgs = {
      FULL: 'Sold Out',
      SOLD_OUT: 'Registration Closed',
      NOT_OPEN_YET: 'Coming Soon! Registration Opens on ',
      WAIT_LIST: 'Sign up to be notified when registration opens for next year’s event.',
      COMING_SOON: 'Coming Soon',
      LOTTERY: '',
    };

    // tslint:disable-next-line: one-variable-per-declaration
    const today = moment.now(),
      rOpens = moment(event.registration_opens, 'YYYY-MM-DD');

    if (event.regStatus in statusMsgs) {
      if (event.regStatus === 'NOT_OPEN_YET') {
        this.getRemainsToOpenRegs(event);
      }

      if (event.regStatus === 'LOTTERY') {
        return (statusMsgs[event.regStatus] = event.lottery_msg);
      }

      if (event.regStatus === 'COMING_SOON') {
        const registrationOpenIn = rOpens.diff(today, 'days') <= 1 ? 1 + ' day' : rOpens.diff(today, 'days') + ' days';
        return (statusMsgs[event.regStatus] = 'Registration will open in ' + registrationOpenIn);
      }

      return (statusMsgs = statusMsgs[event.regStatus]);
    }
  }

  getRemainsToOpenRegs(event) {
    // tslint:disable-next-line: one-variable-per-declaration
    const today = moment.now(),
      rOpens = moment(event.registration_opens, 'YYYY-MM-DD'),
      diffDays = rOpens.diff(today, 'd'),
      diffHours = rOpens.diff(today, 'h'),
      diffMinutes = rOpens.diff(today, 'm');
    this.remainsToOpenRegs = {
      days: diffDays,
      hours: diffHours - diffDays * 24,
      minutes: diffMinutes - diffHours * 60,
    };
  }

  parseLegsDistances(event: MapCourseData): { showBlackLoopToggle: boolean } {
    if (event.type === 'trail' || event.type === 'sunset' || event.type === 'trail_sprint') {
      event.legs.forEach((leg) => {
        if (leg.blackloop && leg.blackloop !== '0') {
          event.showBlackLoopToggle = true;
        }
        switch (leg.difficulty) {
          case 'Easiest':
            leg.color = 'green';
            break;
          case 'Intermediate':
            leg.color = 'yellow';
            break;
          case 'Hardest':
            leg.color = 'red';
            break;
          case 'Black Loop':
            leg.color = 'black';
            break;
        }
      });
    }

    return {
      showBlackLoopToggle: event.showBlackLoopToggle,
    };
  }

  setStatus(events) {
    events.forEach((event) => {
      event.regStatus = this.getStatus(event);
      event.regStatusLabel = this.getRegStatusLabel(event.regStatus);
    });
  }
  setSingleStatus(event) {
    event = this.setRegStatusFlags(event);
    event.regStatus = this.getStatus(event);
    event.regStatusLabel = this.getRegStatusLabel(event.regStatus);
  }
  setRegStatusFlags(event: OverviewRaceData): OverviewRaceData {
    event.registration_opens = moment(event.registration_opens).set({ hour: 0, minute: 0 }).toISOString();
    event.registration_closes = moment(event.registration_closes).set({ hour: 23, minute: 59 }).toISOString();
    const registrationOpen = this.xMomentService.convertDateWithTimezone('MDT', event.registration_opens);
    const registrationClose = this.xMomentService.convertDateWithTimezone('MDT', event.registration_closes);
    const before3Days = this.xMomentService.convertDateWithTimezone('MDT', event.registration_opens).subtract(3, 'd');
    const curruntDate = this.xMomentService.defaultTimeWithTimezone('MDT');
    if (registrationOpen !== before3Days) {
      event.coming_soon = true;
    }
    if (curruntDate >= registrationOpen) {
      event.coming_soon = false;
    }
    const internationalRaceId = ['115', '136', '114', '150', '120', '138', '98', '104', '139', '140'];
    if (curruntDate > registrationClose && !internationalRaceId.includes(event.id)) {
      event.waitlist_flag = true;
      event.waitlist_url = event.waitlist_url ? event.waitlist_url : 'https://form.jotform.com/220866401186152';
    }
    if (event.id === '107') {
      const whitecliffsPrices = [];
      whitecliffsPrices.push({
        name: 'Regular',
        teamPrice: '1600',
        label: 'Early',
        teamSize: '10',
        startDate: '2018-01-19',
        endDate: '2018-04-26',
      });
      whitecliffsPrices.push({
        name: 'Regular',
        teamPrice: '1700',
        label: 'Regular',
        teamSize: '10',
        startDate: '2018-04-27',
        endDate: '2018-07-12',
      });
      whitecliffsPrices.push({
        name: 'Regular',
        teamPrice: '1800',
        label: 'Late',
        teamSize: '10',
        startDate: '2018-07-13',
        endDate: '2018-08-12',
      });
      whitecliffsPrices.push({
        name: 'Ultra',
        teamPrice: '900',
        label: 'Early',
        teamSize: '5',
        startDate: '2018-01-19',
        endDate: '2018-04-26',
      });
      whitecliffsPrices.push({
        name: 'Ultra',
        teamPrice: '950',
        label: 'Regular',
        teamSize: '5',
        startDate: '2018-04-27',
        endDate: '2018-07-12',
      });
      whitecliffsPrices.push({
        name: 'Ultra',
        teamPrice: '1000',
        label: 'Late',
        teamSize: '5',
        startDate: '2018-07-13',
        endDate: '2018-08-12',
      });
      whitecliffsPrices.push({
        name: 'Six-Pack',
        teamPrice: '850',
        label: 'Early',
        teamSize: '5',
        startDate: '2018-01-19',
        endDate: '2018-04-26',
      });
      whitecliffsPrices.push({
        name: 'Six-Pack',
        teamPrice: '900',
        label: 'Regular',
        teamSize: '5',
        startDate: '2018-04-27',
        endDate: '2018-07-12',
      });
      whitecliffsPrices.push({
        name: 'Six-Pack',
        teamPrice: '950',
        label: 'Late',
        teamSize: '5',
        startDate: '2018-07-13',
        endDate: '2018-08-12',
      });
      event.pricing = whitecliffsPrices;
    }

    if (event.id === '104') {
      const ontarioTrailPrices = [];
      ontarioTrailPrices.push({
        name: 'Regular',
        teamPrice: '1179',
        label: 'Early',
        teamSize: '8',
        startDate: '2019-03-18',
        endDate: '2019-04-03',
      });
      ontarioTrailPrices.push({
        name: 'Regular',
        teamPrice: '1299',
        label: 'Regular',
        teamSize: '8',
        startDate: '2019-04-04',
        endDate: '2019-07-10',
      });
      ontarioTrailPrices.push({
        name: 'Regular',
        teamPrice: '1419',
        label: 'Last Chance',
        teamSize: '8',
        startDate: '2019-07-11',
        endDate: '2019-07-31',
      });
      ontarioTrailPrices.push({
        name: 'Ultra',
        teamPrice: '739',
        label: 'Early',
        teamSize: '4',
        startDate: '2019-03-18',
        endDate: '2019-04-03',
      });
      ontarioTrailPrices.push({
        name: 'Ultra',
        teamPrice: '799',
        label: 'Regular',
        teamSize: '4',
        startDate: '2019-04-04',
        endDate: '2019-07-10',
      });
      ontarioTrailPrices.push({
        name: 'Ultra',
        teamPrice: '859',
        label: 'Last Chance',
        teamSize: '4',
        startDate: '2019-07-11',
        endDate: '2019-07-31',
      });
      event.pricing = ontarioTrailPrices;
    }
    return event;
  }
}
