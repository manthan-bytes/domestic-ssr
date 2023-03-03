import { Component, Input, OnInit } from '@angular/core';
import { Team, UserRegistrationInfo } from '@core/interfaces/rcms-team-runner-information.interface';
import { RcmsEventDetail } from '@core/interfaces/rcms-event-details.interface';
import lodashFilter from 'lodash/filter';
import find from 'lodash/find';
import sumBy from 'lodash/sumBy';
import { RCMSEventDataService } from '@core/data';
import { EventData, Legs } from '@core/interfaces/team-center.interface';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-team-center-runner-assignments',
  templateUrl: './runner-assignments.component.html',
  styleUrls: ['./runner-assignments.component.scss'],
})
export class RunnerAssignmentsComponent {
  @Input() isCaptain: boolean;
  @Input() selectedEvent: RcmsEventDetail;
  @Input() teamInformation: Team;
  @Input() legs: Legs[];
  @Input() runnerInformation: UserRegistrationInfo[];
  @Input() eventData: EventData;
  @Input() profileImages = [] || null;
  @Input() eventType: string;

  public vanArr = {
    ROAD: {
      REGULAR: [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
      ],
      ULTRA: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      HIGH_SCHOOL: [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
      ],
      SIX_PACK: [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
      ],
    },
    TRAIL: {
      REGULAR: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ],
      ULTRA: [
        [1, 2],
        [3, 4],
      ],
      HIGH_SCHOOL: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ],
      BLACK_LOOP: [[1], [2]],
    },
    SPRINT: {
      REGULAR: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      ULTRA: [[1, 2], [3]],
      HIGH_SCHOOL: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      SIX_PACK: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    },
    SUNSET: {
      REGULAR: [
        [1, 2],
        [3, 4],
      ],
      ULTRA: [[1], [2]],
      HIGH_SCHOOL: [
        [1, 2],
        [3, 4],
      ],
      BLACK_LOOP: [[1], [2]],
    },
    TRAIL_SPRINT: {
      REGULAR: [
        [1, 2],
        [3, 4],
      ],
      ULTRA: [[1], [2]],
      HIGH_SCHOOL: [
        [1, 2],
        [3, 4],
      ],
      BLACK_LOOP: [[1], [2]],
    },
  };

  public dummyName = ['Jane O’Brien', 'Unassigned', 'Unassigned', 'Unassigned', 'Unassigned', 'Unassigned'];

  public show = {
    loading: false,
  };

  constructor(private rcmsEventDataService: RCMSEventDataService, private dataLayerService: DataLayerService) {}

  filterRunner(runners, assigned) {
    return lodashFilter(runners, (o) => {
      return assigned ? o.order > 0 : o.order === 0;
    });
  }

  totalDistance(isBlackloop) {
    if (this.legs.length > 0) {
      let Total = sumBy(this.legs, (o) => (o ? o.distance * 1 : 0));
      let blackLoop: any = find(this.legs, { difficulty: 'Black Loop' });
      blackLoop = blackLoop ? (blackLoop.distance ? blackLoop.distance : 0) : 0;
      Total = isBlackloop ? blackLoop * 1 : Total - blackLoop * 1;
      return parseFloat(Total.toFixed(2));
    }
    return 0;
  }

  getRunner(order) {
    const runners = this.runnerInformation;
    const team = this.teamInformation;

    if (team.groupId && team.type === 'SIX_PACK' && team.vanNumber) {
      order = team.vanNumber === 2 ? order - 6 : order;
    }

    return order !== '!0' ? find(runners, { order }) : find(runners, (o) => o.order > 0);
  }

  getLegs(order) {
    const stepArr = { ROAD: 6, SPRINT: 3, TRAIL: 4, SUNSET: 2, TRAIL_SPRINT: 2 };
    const loopArr = {
      ULTRA: { ROAD: 6, SPRINT: 4, TRAIL: 6, SUNSET: 4, TRAIL_SPRINT: 4 },
      ALL: { ROAD: 3, SPRINT: 2, TRAIL: 3, SUNSET: 2, TRAIL_SPRINT: 2 },
    };

    const runOption = this.teamInformation.runOption;
    const type = this.teamInformation.type;
    const eType = this.eventType;
    const step = type === 'ULTRA' ? stepArr[eType] : stepArr[eType] * 2;
    const legs = this.legs;
    const txtArr = eType === 'ROAD' || eType === 'SPRINT' ? ['Easy', 'Hard', 'Moderate'] : ['Red', 'Green', 'Yellow'];

    let htm = '';

    if (legs.length > 0) {
      for (let i = 0; i < loopArr[type === 'ULTRA' ? 'ULTRA' : 'ALL'][eType]; i++) {
        let leg = order + i * step;
        if (runOption === 2) {
          leg = order + (order - 1) + i * step;
          leg = i % 2 !== 0 ? leg - (step - 1) : leg;
        }
        const distance = legs[leg] ? (legs[leg].distance ? legs[leg].distance : '') : '';
        htm += '<li><span>';
        htm += (eType === 'ROAD' || eType === 'SPRINT' ? 'leg' : 'Team Loop') + ' ' + leg + ' - ' + ' ';
        htm += eType === 'ROAD' ? distance + ' miles - ' : '';
        htm += eType === 'SPRINT' ? distance + ' miles' : '';
        if (eType === 'ROAD') {
          htm += (legs[leg] ? (legs[leg].difficulty ? legs[leg].difficulty : '') : '') + '</span></li>';
        } else if (eType === 'TRAIL' || eType === 'SUNSET' || eType === 'TRAIL_SPRINT') {
          htm += txtArr[leg % 3] + '</span></li>';
        }
      }
    }
    return htm;
  }

  toggleOption(runOption) {
    const teamInformation = this.teamInformation;
    if (runOption !== teamInformation.runOption) {
      teamInformation.runOption = runOption;
      this.show.loading = true;
      this.rcmsEventDataService.editTeam(teamInformation).subscribe(
        () => {
          this.show.loading = false;
        },
        (err) => {
          this.show.loading = false;
          console.error(err);
        },
      );
    }
  }

  assignOrder(runner1, order) {
    this.show.loading = true;
    const runner2 = this.getRunner(order);
    const runnerInformation = this.runnerInformation;

    const registrationConfigId = runner1.registrationConfigId;
    const teamId = runner1.teamId;

    if (order !== 0) {
      const team = this.teamInformation;

      if (team.groupId && team.type === 'SIX_PACK' && team.vanNumber) {
        order = team.vanNumber === 2 ? order - 6 : order;
      }
    }

    const data = [{ registrationId: runner1.id, order }];
    if (runner2) {
      data.push({ registrationId: runner2.id, order: 0 });
    }

    this.rcmsEventDataService.assignRunnerOrder(registrationConfigId, teamId, data).subscribe(
      () => {
        if (runner2) {
          const runner2Data = find(runnerInformation, { id: runner2.id });
          runner2Data.order = 0;
        }
        const runner1Data = find(runnerInformation, { id: runner1.id });
        runner1Data.order = order;
        this.show.loading = false;
      },
      (err) => {
        this.show.loading = false;
        console.error(err);
      },
    );
  }
}
