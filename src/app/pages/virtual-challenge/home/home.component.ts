import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { virtualChallengeRoutes } from '@core/utils/routes-path.constant.service';
import { VirtualChallengeDataService, VirtualChallengeInviteDataService } from '@core/data/virtual-challenge/virtual-challenge.service';
import { CommonModelDialogComponent } from '@components/virtual-challenge/common-model-dialog/common-model-dialog.component';
import { VIRTUAL_CHALLENGE_TYPE } from '@core/enums/virtual-challenge-type.enum';
import { VirtualChallengeSharedDataService } from '@core/utils/virtual-challenge-shared-data.service';
import { UserInfo } from '@core/interfaces/auth.interface';
import { DataLayerService, LocalStorageService, XMomentService } from '@core/utils';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public routes = virtualChallengeRoutes;

  public show = {
    filterOptions: true,
  };
  public challenges = [];
  public virtualChallanges = [];
  public featuredChallenges = [];
  public nonFeaturedChallenges = [];
  public filters = {
    fields: '',
    challenge: {
      virtual: false,
      community: false,
      brand: false,
      onDemand: false,
      upComing: false,
      openNow: false,
    },
  };
  public virtualChallengeNotifications;
  public loading = false;
  public userData: UserInfo = null;
  // tslint:disable-next-line: no-any
  public inviteDetails: any[];
  public isNextClicked: boolean;
  public fetchingChallenges: boolean = true;

  constructor(
    private virtualChallengeDataService: VirtualChallengeDataService,
    private modalService: NgbModal,
    private router: Router,
    private virtualChallengeSharedDataService: VirtualChallengeSharedDataService,
    private virtualChallengeInviteDataService: VirtualChallengeInviteDataService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private dataLayerService: DataLayerService,
    private xMomentService: XMomentService,
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'virtual-challenge-home',
      pagePostType: 'virtualChallengeHome',
      pagePostType2: 'single-page',
    });
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) {
      this.show.filterOptions = false;
    }
    this.virtualChallengeSharedDataService.getNotifications().subscribe((response) => {
      if (response) {
        this.virtualChallengeNotifications = response;
      }
    }, this.handleError);
    this.userData = this.localStorageService.getUser() || null;

    this.route.queryParams.subscribe((params) => {
      const isNewChallengeStart = params.isNewChallengeStart;
      if (isNewChallengeStart) {
        this.getAllActiveChallenge();
        this.getPendingInvites();
      } else if (this.userData) {
        this.checkUserChallenge();
        this.getPendingInvites();
      } else {
        this.getAllActiveChallenge();
      }
    });
  }

  getPendingInvites() {
    this.virtualChallengeInviteDataService.getPendingInvites(this.userData.emailAddress).subscribe(
      (response) => {
        this.inviteDetails = response;
      },
      (error) => {},
    );
  }

  checkUserChallenge() {
    this.loading = true;
    this.route.queryParams.subscribe((data) => {
      this.isNextClicked = data?.next ? true : false;
    });
    this.virtualChallengeDataService.getUserExistingChallenge(this.userData.id).subscribe(
      (response) => {
        if (this.isNextClicked) {
          this.getAllActiveChallenge();
        } else if (response.unitType === 'ACTIVITY') {
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.DcDashboard}`]);
        } else {
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
        }
        // this.getChallengeInfo();
      },
      (error) => {
        this.loading = false;
        this.getAllActiveChallenge();
      },
    );
  }

  getAllActiveChallenge() {
    this.virtualChallengeDataService.getAll().subscribe(
      async (challenges) => {
        this.challenges = challenges.filter((f) => {
          const today = this.xMomentService.defaultTime();
          const endDate = this.xMomentService.convertDateIntoDefaultTime(f.endDate);
          const graceDate = this.xMomentService.convertDateIntoDefaultTime(f.graceDate);
          if (today.isBefore(endDate) || today.isBefore(graceDate)) {
            return true;
          } else {
            return false;
          }
        });
        await this.makeChallengeArray(this.challenges);
        this.fetchingChallenges = false;
        this.loading = false;
      },
      (error) => {
        console.error('HomeComponent -> ngOnInit -> error', error);
      },
    );
  }
  /* getAllVirtualChallenge() {
    this.loading = true;
    this.virtualChallengeDataService.getAllVirtualChallanges().subscribe((challenges: VirtualChallengeList[]) => {
      this.challenges = challenges;
      this.loading = false;
      this.makeChallengeArray(this.challenges);
    }, this.handleError);
  } */
  handleError(error) {
    this.loading = false;
    console.error(error);
  }

  challengeFilter() {
    const filteredChallenges = [];
    const today = Date.now();
    let isFilterEnable = false;
    this.challenges.map((challenge) => {
      const startDate = new Date(challenge.startDate).getTime();
      // const endDate = new Date(challenge.endDate).getTime();
      if (this.filters.challenge.virtual && challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.ROAD_COMMUNITY) {
        filteredChallenges.push(challenge);
      }

      if (
        this.filters.challenge.openNow &&
        this.filters.challenge.onDemand &&
        challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.TEAM &&
        startDate < today
      ) {
        filteredChallenges.push(challenge);
      } else if (this.filters.challenge.upComing && challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.TEAM) {
      } else if (this.filters.challenge.onDemand && challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.TEAM) {
        filteredChallenges.push(challenge);
      } else if (this.filters.challenge.openNow && startDate < today) {
        filteredChallenges.push(challenge);
      }

      if (this.filters.challenge.community && challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.COMMUNITY) {
        filteredChallenges.push(challenge);
      }
      if (
        this.filters.challenge.brand &&
        (challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.MARATHON || challenge.challengeType === VIRTUAL_CHALLENGE_TYPE.BRAND)
      ) {
        filteredChallenges.push(challenge);
      }
    });

    Object.values(this.filters.challenge).forEach((value) => {
      if (value) {
        isFilterEnable = true;
      }
    });

    this.makeChallengeArray(filteredChallenges.length || isFilterEnable ? filteredChallenges : this.challenges);
  }

  makeChallengeArray(challenges) {
    this.featuredChallenges = challenges.filter((challenge) => challenge.isFeatured);
    this.nonFeaturedChallenges = challenges.filter((challenge) => !challenge.isFeatured);
  }

  showInvites() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'pending_invit',
    });

    modalRef.componentInstance.componentData = {
      type: 'invite',
      title: 'Challenge Invites',
      inviteDetails: this.inviteDetails,
    };
  }
  checkUnitType(unitType, value) {
    switch (unitType) {
      case 'DISTANCE':
        return value === 'mile';
      case 'ELEVATION':
        return value === 'elevation';
      case 'ACTIVITY':
        return value === 'activity';
      default:
        break;
    }
  }

  routeToInfoPage(featuredChallengeId: number): void {
    const queryParams = { challengeId: featuredChallengeId };
    if (this.inviteDetails && this.inviteDetails.length > 0 && this.inviteDetails[0].challenge.unitType === 'ACTIVITY') {
      Object.assign(queryParams, { isAcceptInvite: true });
      Object.assign(queryParams, { challengeTeamId: this.inviteDetails[0].challengeTeam.id });
    }
    this.router.navigate(['/' + this.routes.main, this.routes.info], { queryParams });
  }
}
