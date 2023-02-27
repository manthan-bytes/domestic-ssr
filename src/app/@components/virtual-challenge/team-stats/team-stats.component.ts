import { AfterContentChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment-timezone';
import { badgeDays } from 'src/app/@core/utils/var.constant.service';
import { XMomentService } from 'src/app/@core/utils/xMoment.service';

@Component({
  selector: 'app-virtual-challenge-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.scss'],
})
export class TeamStatsComponent implements OnInit, AfterContentChecked {
  @Input() teamMemberDetail;
  @Input() challengeDetails;
  @Input() existingMember;
  @Output() deleteMemberEvent = new EventEmitter();

  displayRemoveBtn = true;
  btnFlag = false;
  removebtnFlag = false;
  public show = {
    allChallengeTeamMembers: 10,
  };
  public nextBadge: string;
  badgeDays = badgeDays;
  constructor(private xMomentService: XMomentService) {}

  ngOnInit(): void {
    const currentDate = this.xMomentService.defaultTimeWithTimezone('MDT');
    const endDate = moment.utc(this.challengeDetails.endDate);
    if (endDate < currentDate) {
      this.displayRemoveBtn = false;
    }
  }

  ngAfterContentChecked(): void {
    if (this.teamMemberDetail && this.teamMemberDetail.length > 1) {
      this.teamMemberDetail.forEach((member) => {
        member.removable = member.role !== 'CAPTAIN' ? true : false;
      });
    } else if (this.teamMemberDetail) {
      this.teamMemberDetail[0].removable = true;
    }
  }

  seeallFunc() {
    if (this.show.allChallengeTeamMembers <= 10) {
      this.btnFlag = true;
      this.show.allChallengeTeamMembers = this.teamMemberDetail.length;
    } else {
      this.btnFlag = false;
      this.show.allChallengeTeamMembers = 10;
    }
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

  updateRemoveBtnFlag() {
    this.removebtnFlag = !this.removebtnFlag;
  }

  deleteMember(member) {
    this.deleteMemberEvent.emit(member);
  }
}
