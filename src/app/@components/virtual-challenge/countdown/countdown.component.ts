import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { XMomentService } from 'src/app/@core/utils/xMoment.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountDownComponent implements OnInit {
  constructor() {}

  @Input() challengeStartDate;

  public distance = {
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer() {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const countDown = moment.utc(this.challengeStartDate).valueOf();
    const x = setInterval(() => {
      const now = new XMomentService().defaultTime().valueOf();
      const distance = countDown - now;
      this.distance.day = Math.floor(distance / day);
      this.distance.hours = Math.floor((distance % day) / hour);
      this.distance.minutes = Math.floor((distance % hour) / minute);
      this.distance.seconds = Math.floor((distance % minute) / second);

      if (distance < 0) {
        clearInterval(x);
      }
    }, 1000);
  }
}
