import { Component, Input } from '@angular/core';
import { VirtualChallengeLeaderBoard } from 'src/app/@core/interfaces/virtual-challenge.interface';

@Component({
  selector: 'app-virtual-challenge-round-progress-bar',
  templateUrl: './round-progress-bar.component.html',
  styleUrls: ['./round-progress-bar.component.scss'],
})
export class RoundProgressBarComponent {
  @Input() memberDetail: VirtualChallengeLeaderBoard;
  // tslint:disable-next-line: no-any
  @Input() teamDetail: unknown | any;
  @Input() challengeType: string;
  // tslint:disable-next-line: no-any
  @Input() existingMember: any;

  constructor() {}
}
