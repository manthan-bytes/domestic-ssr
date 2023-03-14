import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { VirtualChallengeDetail, VirtualChallengeLeaderBoard, VirtualChallengeTeam } from '@core/interfaces/virtual-challenge.interface';
import { DataLayerService, MetaTagsService, virtualChallengeRoutes } from '@core/utils';
import { VirtualChallengeDataService, VirtualChallengeMemberDataService, VirtualChallengeTeamDataService } from '@core/data';
import { UserInfo } from '@core/interfaces/auth.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModelDialogComponent } from '@components/virtual-challenge/common-model-dialog/common-model-dialog.component';
import { environment } from 'src/environments/environment';
import { ToastService } from '@components/toast/toast.service';

@Component({
  selector: 'app-public-share',
  templateUrl: './public-share.component.html',
  styleUrls: ['./public-share.component.scss'],
})
export class PublicShareComponent implements OnInit {
  public virtualRoutes = virtualChallengeRoutes;
  public show = {
    error: false,
    isResultComplete: false,
    result: false,
    loading: false,
    safeText: `Not Safe!`,
    remaining: {
      totalDays: null,
      days: null,
      hours: null,
    },
    runToSafe: 0,
    isChallengeStarted: false,
  };

  public challengeDetail: VirtualChallengeDetail;
  public leaderBoardDetail: VirtualChallengeLeaderBoard;

  public userData: UserInfo = null;

  public curruntURL = null;
  private params;
  public teamDetail: VirtualChallengeTeam & { achieved_run?: number };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private metaTagsServices: MetaTagsService,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    private virtualChallengeTeamDataService: VirtualChallengeTeamDataService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'virtual-challenge-public-share',
      pagePostType: 'virtualChallengePublicShare',
      pagePostType2: 'single-page',
    });
    this.curruntURL = this.router.url;

    this.route.params.subscribe((params) => {
      this.params = params;
      if (params.id) {
        this.getUserExistingChallenge(params.id);
      }
    });
  }

  getUserExistingChallenge(id) {
    this.show.loading = true;
    this.virtualChallengeDataService.getUserExistingChallenge(id).subscribe(
      (response) => {
        this.challengeDetail = response;
        this.metaTagsServices.setTitle(
          `Ragnar Virtual Challenge | Progress | ${this.challengeDetail.name} | ${this.challengeDetail.contents.INFO_PAGE.subTitle}`,
        );
        if (this.challengeDetail.isChallengeCompleted) {
          this.show.result = true;
          this.getMemberDetails(this.challengeDetail.challengeMemberId);
        }

        if (this.challengeDetail.challengeType === 'TEAM') {
          this.getTeamDetails(this.challengeDetail.challengeTeamId);
        }
        this.calculateRemainingDaysAndHours();
        this.getLeaderBoardData();
      },
      (err) => {
        if (err.error.statusCode === 404) {
          this.show.error = true;
          this.show.loading = false;
        }
      },
    );
  }

  getLeaderBoardData() {
    this.virtualChallengeDataService
      .getLeaderBoardData(this.challengeDetail.id, this.challengeDetail.challengeMemberId, false, true)
      .subscribe(
        (response) => {
          this.leaderBoardDetail = response;
          this.calculateSafeState();
          this.calculateMilesRunToBecomeSafe();
          this.show.loading = false;
        },
        (err) => {
          this.show.error = true;
          this.show.loading = false;
        },
      );
  }

  getTeamDetails(teamId: string) {
    this.virtualChallengeTeamDataService.getByid(teamId).subscribe(
      (response) => {
        this.show.loading = false;
        this.teamDetail = response;
        this.show.isChallengeStarted = true;
        this.calculateRemainingDaysAndHours();
        // this.getTeamMemberDetails(this.challengeDetail.id, this.teamDetail.id);
        return response;
      },
      (error) => {
        console.error('DashboardComponent -> getTeamDetails -> error', error);
      },
    );
  }

  calculateSafeState() {
    if (this.leaderBoardDetail.existingMember.currentSafeStatus === 'NOT_SAFE') {
      this.show.safeText = `Not Safe!`;
      this.leaderBoardDetail.safeState = 'NOT';
    } else if (this.leaderBoardDetail.existingMember.currentSafeStatus === 'MAYBE_SAFE') {
      this.show.safeText = `Maybe Safe!`;
      this.leaderBoardDetail.safeState = 'MAYBE';
    } else if (this.leaderBoardDetail.existingMember.currentSafeStatus === 'SAFE') {
      this.show.safeText = `Safe!`;
      this.leaderBoardDetail.safeState = 'LIKELY';
    }
  }

  calculateMilesRunToBecomeSafe() {
    /* TODO: Calculation will be changes. */
    const safeRunAvg = (this.leaderBoardDetail.maxRun * 70) / 100;
    if (this.leaderBoardDetail.safeState === 'NOT' && this.leaderBoardDetail.myRun < safeRunAvg) {
      this.show.runToSafe = safeRunAvg - this.leaderBoardDetail.myRun;
    }
  }

  calculateRemainingDaysAndHours() {
    const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
    const endDate = this.teamDetail && this.teamDetail.endDate ? moment(this.teamDetail.endDate) : moment(this.challengeDetail.endDate);
    const startDate =
      this.teamDetail && this.teamDetail.startDate ? moment(this.teamDetail.startDate) : moment(this.challengeDetail.startDate);
    const days = today.diff(startDate, 'days') + 1;
    if (today.isAfter(startDate)) {
      this.show.isChallengeStarted = true;
    }
    this.show.remaining.totalDays = endDate.diff(startDate, 'days');
    // this.show.remaining.totalDays = this.challengeDetail.maxDays;
    this.show.remaining.days = days > this.challengeDetail.maxDays ? this.challengeDetail.maxDays : days;
    this.show.remaining.hours = endDate.diff(today, 'hours') > 0 ? endDate.diff(today, 'hours') : 0;
  }

  getChallengeInfo(challengeId) {
    this.virtualChallengeDataService.getByid(challengeId).subscribe(
      (response) => {
        this.challengeDetail = response;
      },
      (error) => {
        console.error('DashboardComponent -> getChallengeInfo -> error', error);
      },
    );
  }

  showFaqs() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'y_info',
    });

    modalRef.componentInstance.componentData = {
      type: 'faq',
      title: 'What Does This Mean?',
      faqs: this.challengeDetail.contents.DASHBOARD.faqs,
    };
  }

  copyLink() {
    const url = `${location.origin}${environment.BASE_URL}${virtualChallengeRoutes.main}/${virtualChallengeRoutes.publicShare}/${this.params.id}`;

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toastService.show('Link copied to clipboard', { classname: 'bg-success text-light', delay: 3000 });
  }

  getMemberDetails(id: string) {
    this.virtualChallengeMemberDataService.getByid(id).subscribe(
      (response) => {
        this.show.isResultComplete = response.isGoalAchieved;
      },
      (error) => {
        console.error('DashboardComponent -> getTeamMemberDetails -> error', error);
      },
    );
  }
}
