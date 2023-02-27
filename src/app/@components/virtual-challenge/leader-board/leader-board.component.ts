import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { VirtualChallengeLeaderBoard, RankPocessedData, ExistingMember } from 'src/app/@core/interfaces/virtual-challenge.interface';

@Component({
  selector: 'app-virtual-challenge-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss'],
})
export class LeaderBoardComponent implements OnInit {
  @Input() leaderBoardDetail: VirtualChallengeLeaderBoard;
  @Input() challengeMemberId: string;

  constructor(private translate: TranslateService) {}

  public data: RankPocessedData;
  public MAX_RUNNER_SHOW = 2;
  public existingMember: ExistingMember;

  ngOnInit(): void {
    this.challengeMemberId = this.challengeMemberId;
    this.data = this.leaderBoardDetail.rankPocessedData;
    this.existingMember = this.leaderBoardDetail.existingMember;
    this.translate.setDefaultLang('en');
  }
}
