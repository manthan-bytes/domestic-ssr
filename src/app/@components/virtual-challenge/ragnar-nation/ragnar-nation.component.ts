import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import {isPlatformBrowser} from '@angular/common'

@Component({
  selector: 'app-virtual-challenge-ragnar-nation',
  templateUrl: './ragnar-nation.component.html',
  styleUrls: ['./ragnar-nation.component.scss'],
})
export class RagnarNationComponent implements OnInit {
  @Input() ragnarNation;
  btnFlag = false;
  public unavailableImages = ['running from bears', 'wrestling dragons', 'typical viking stuff'];
  declare frontActivities: Array<string>;
  declare activities: Array<string>;
  declare mobileScreen: boolean;
  show = {
    ragnarNationLimit: 5,
  };
  constructor(@Inject(PLATFORM_ID) private platformId:Object) {}
  public frontActivitiesCount = 0;

  ngOnInit(): void {
    this.frontActivities = this.ragnarNation.activities.filter((activity) => {
      if (!this.unavailableImages.includes(activity.activityType) && this.frontActivitiesCount < 5) {
        this.frontActivitiesCount++;
        return activity;
      }
    });
    this.activities = this.frontActivities;

    this.mobileScreen = (isPlatformBrowser(this.platformId) && (window.screen.width <= 767 ))? true : false;
  }

  calculateHeight(percentage) {
    return Math.ceil(percentage);
  }
  getImagePath(image) {
    return `assets/images/virtual-challenge/activity-icon/${image.replaceAll(' ', '_').toLowerCase().replaceAll('/', '_')}.png`;
  }
  showAll() {
    if (this.activities === this.frontActivities) {
      this.btnFlag = true;
      this.activities = this.ragnarNation.activities;
    } else {
      this.btnFlag = false;
      this.activities = this.frontActivities;
    }
  }

  checkMobileScreen(): boolean {
    return (isPlatformBrowser(this.platformId) && (window.screen.width <= 767 )) ? true : false;
  }
}
