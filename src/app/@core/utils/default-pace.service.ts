import { Injectable } from '@angular/core';

@Injectable()
export class DefaultPaceService {
  constructor() {}

  getPace() {
    const paceValue = [];
    const lowestSeconds = 300;
    const highestSeconds = 1200;
    paceValue.push({
      title: '00:00',
      value: 0,
    });
    for (let seconds = lowestSeconds; seconds <= highestSeconds; seconds += 30) {
      paceValue.push({
        title: this.secondsToHms(seconds),
        value: seconds,
      });
    }

    return paceValue;
  }

  secondsToHms(secondsValue) {
    secondsValue = Number(secondsValue);
    const minutes = Math.floor((secondsValue % 3600) / 60);
    const seconds = Math.floor((secondsValue % 3600) % 60);

    const minutesDisplay = minutes > 0 ? (minutes.toString().match(/^\d$/) ? '0' + minutes : minutes) + ':' : '';
    const secondsDisplay = seconds > 0 ? seconds + (seconds === 1 ? '' : '') : '';
    return minutesDisplay + (secondsDisplay ? secondsDisplay : '00');
  }
}
