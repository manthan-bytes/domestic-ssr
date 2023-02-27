import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { VirtualChallengeUtilDataService } from 'src/app/@core/data';
import { AddActivity } from 'src/app/@core/interfaces/virtual-challenge.interface';
import { XMomentService } from 'src/app/@core/utils';
import { badgeDays } from 'src/app/@core/utils/var.constant.service';
import { ToastService } from '../../toast/toast.service';
import { months, activities, successActivityMessages } from './dc-data';

@Component({
  selector: 'app-add-latest-activity',
  templateUrl: './add-latest-activity.component.html',
  styleUrls: ['./add-latest-activity.component.scss'],
})
export class AddLatestActivityComponent implements OnInit {
  @Input() componentData;
  @Output() emitSuccess = new EventEmitter<number>();

  status = false;
  public showCalendarFlag = false;
  public showAllActivityFlag = false;
  public newDate;
  public minDate: {
    year: number;
    month: number;
    day: number;
  };
  public maxDate: {
    year: number;
    month: number;
    day: number;
  };
  public selectedDate: string;
  public datePristine = true;
  public userProfileData = JSON.parse(localStorage.getItem('profilesUser'));
  public selectedActivity = { name: '', src: '', alt: '' };
  public successFunMessage;
  public show = {
    errorMessage: '',
    loading: false,
    activityAdded: false,
    challengeOver: false,
  };

  public badgeDays = badgeDays;
  public months = months;
  public activities = activities;
  public successActivityMessages = successActivityMessages;
  public streaks = [];
  public today: string;
  constructor(
    private activeModal: NgbActiveModal,
    private virtualChallengeUtilDataService: VirtualChallengeUtilDataService,
    private xMomentService: XMomentService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.streaks = this.componentData.challengeDetails.streakDates.map((a) => a.streakDates);
    const current = new Date();
    this.selectedDate = `${current.getFullYear()}/${current.getMonth() + 1}/${current.getDate()} 00:00:00`;
    this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD');
    this.today = this.months[current.getMonth()] + ' ' + current.getDate();
    this.newDate = this.today;
    const startChallnage = this.xMomentService.convertDateIntoDefaultTime(
      new Date(moment(this.componentData.challengeDetails.startDate).add(10, 'hours').toISOString()),
    );
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };

    const endDate = moment(this.componentData.challengeDetails.endDate.split('T')[0]);
    if (moment(this.selectedDate).isAfter(endDate) || moment(this.newDate).isSame(endDate)) {
      this.newDate = endDate.format('MMMM D');
      this.selectedDate = `${endDate.year()}/${endDate.month() + 1}/${endDate.date()} 00:00:00`;
      this.selectedDate = this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD');
      this.today = this.newDate;
      this.maxDate.day = +endDate.format('D');
      this.maxDate.month = +endDate.format('M');
      this.maxDate.year = +endDate.format('YYYY');
    }

    this.minDate = {
      year: startChallnage.year(),
      month: startChallnage.month() + 1,
      day: startChallnage.date(),
    };
  }
  checkDateMark(date) {
    return this.streaks.includes(`${date.year}-${('0' + date.month).slice(-2)}-${('0' + date.day).slice(-2)}`);
  }
  showAllActivity() {
    this.showAllActivityFlag = true;
  }
  closeModal(args) {
    this.activeModal.close(args);
  }

  onDateSelection(date: NgbDateStruct) {
    this.selectedDate = `${date.year}/${date.month}/${date.day} 00:00:00`;
    // this.selectedDate = this.xMomentService.convertDateTimeWithTimezone('UTC', this.selectedDate).format();
    this.selectedDate = moment(this.selectedDate).format('YYYY-MM-DD');

    this.newDate = this.months[date.month - 1] + ' ' + date.day;
    this.showCalendarFlag = false;
    this.datePristine = false;
  }
  selectActivity(activity) {
    this.selectedActivity = activity;
  }
  showCalendar() {
    this.showCalendarFlag = this.showCalendarFlag ? false : true;
  }

  addActivity() {
    const addRunDetail = {
      challengeId: this.componentData.challengeDetails.id,
      challengeTeamId: this.componentData.challengeDetails.challengeTeamId,
      challengeMemberId: this.componentData.challengeDetails.challengeMemberId,
      content: {},
      type: 'ACTIVITY',
      logDate: this.selectedDate,
      stravaActivityId: '',
      activityType: this.selectedActivity.name,
      unit: 0.01,
    };
    this.show.loading = true;
    this.virtualChallengeUtilDataService.addActivity(addRunDetail).subscribe(
      (response: AddActivity & { activityStreak: number }) => {
        this.componentData.memberDetails.activityStreak = response.activityStreak;
        this.componentData.memberDetails.logDate = moment(response.logDate).toISOString();
        this.componentData.memberDetails.totalActivities = response.totalActivities;
        if (this.componentData.challengeDetails.challengeType === 'COMMUNITY') {
          const like = {};
          like[`${this.userProfileData.data.id}`] = false;
          const feedDetails = {
            createdBy: this.userProfileData.data.id,
            createdAt: this.xMomentService.defaultTime().toISOString(),
            profileId: this.userProfileData.data.id,
            loggedMile: response.totalActivities || 0,
            likes: like,
          };
          this.successFunMessage = this.successActivityMessages[Math.floor(Math.random() * (this.successActivityMessages.length - 1))];
          this.show.activityAdded = true;
        }
      },
      (err) => {
        this.show.loading = false;
        if (err.error.code && err.error.code === 'CHALLENGE_IS_OVER') {
          this.show.challengeOver = true;
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        } else if (err.error.code && (err.error.code === 'MAX_ACTIVITY_LIMIT_REACHED' || err.error.code === 'MAX_ACTIVITY_MILES_REACHED')) {
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        } else {
          this.toastService.show('Something went wrong. Try again after few minutes!', { classname: 'bg-dark text-light', delay: 3000 });
        }
        this.emitSuccess.emit();
      },
    );
  }

  getSrcOfBadge(member) {
    for (let j = 0; j < this.badgeDays.length; j++) {
      if (member.activityStreak >= 31) {
        return `assets/31dc/images/challenge/31_day_2022/badges/31-day.png`;
      }
      if (member.activityStreak === this.badgeDays[j]) {
        return `assets/31dc/images/challenge/31_day_2022/badges/badge_${this.badgeDays[j + 1]}.png`;
      } else if (this.badgeDays[j] > member.activityStreak) {
        return `assets/31dc/images/challenge/31_day_2022/badges/badge_${this.badgeDays[j]}.png`;
      }
    }
  }

  onClose() {
    this.emitSuccess.emit(+this.componentData.memberDetails.activityStreak);
    this.activeModal.close();
  }
}
