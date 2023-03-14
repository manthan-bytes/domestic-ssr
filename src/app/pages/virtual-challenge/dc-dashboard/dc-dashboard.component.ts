import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLatestActivityComponent } from '@components/virtual-challenge/add-latest-activity/add-latest-activity.component';
import { InviteModalComponent } from '@components/virtual-challenge/invite-modal/invite-modal.component';
import {
  LocalStorageService,
  XMomentService,
  virtualChallengeRoutes,
  authRoutes,
  localStorageConstant,
  MetaTagsService,
  badgeDays,
} from '@core/utils';
import { VirtualChallengeTeam, VirtualChallengeDetail, VirtualChallengeMember } from '@core/interfaces/virtual-challenge.interface';
import { VirtualChallengeSharedDataService } from '@core/utils/virtual-challenge-shared-data.service';
import {
  VirtualChallengeTeamDataService,
  VirtualChallengeDataService,
  VirtualChallengeMemberDataService,
  VirtualChallengeCommunityService,
} from '@core/data';
import { BadgeAchievementModalComponent } from '@components/virtual-challenge/badge-achievement-modal/badge-achievement-modal.component';
import { UserInfo } from '@core/interfaces/auth.interface';
import { CommonModelDialogComponent } from '@components/virtual-challenge/common-model-dialog/common-model-dialog.component';
import { FaqModalComponent } from '@components/virtual-challenge/faq-modal/faq-modal.component';
import * as moment from 'moment-timezone';
import * as $ from 'jquery';
import { dashboardScreenMenu, show, screens } from './dc-dashboard-constants';
import { StaticPageService } from '@core/data';
import { Testimonials } from '@core/interfaces/testimonials.interface';
import { ToastService } from '@components/toast/toast.service';
@Component({
  selector: 'app-dc-dashboard',
  templateUrl: './dc-dashboard.component.html',
  styleUrls: ['./dc-dashboard.component.scss'],
})
export class DcDashboardComponent implements OnInit, OnDestroy {
  public remainingPercentage: number;
  public remainingDays: number;
  public badgeDays = badgeDays;
  // tslint:disable-next-line: no-any
  public ragnarNationActivity: any;
  public dashboardScreenMenu = dashboardScreenMenu;
  public show = show;
  quotes: Testimonials[];

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private virtualChallengeTeamDataService: VirtualChallengeTeamDataService,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    public virtualChallengeCommunityService: VirtualChallengeCommunityService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private xMomentService: XMomentService,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private metaTagsServices: MetaTagsService,
    private virtualChallengeSharedDataService: VirtualChallengeSharedDataService,
    private staticPageService: StaticPageService,
    private toastService: ToastService,
  ) {}

  public teamMemberDetail: VirtualChallengeMember[];
  public existingMember: VirtualChallengeMember;
  public activityStreak: string;
  public teamActivityStreak: number;
  public userData: UserInfo = null;
  public challengeDetail: VirtualChallengeDetail;
  public teamDetail: VirtualChallengeTeam & { achieved_run?: number; totalActivities: number };
  public invitedByName = '';
  public excludeScreen = ['addRun', 'invite'];
  public fragment: string;
  public selectedScreen = 'Team Stats';
  public faqs = [];
  public editTeamName = false;
  public currentDate: moment.Moment;
  public startDate: moment.Moment;
  public mobileScreen = false;
  public screens = screens;
  public isChallengeOver = false;
  public showResults = false;
  public maxDays = 0;
  public isCompleteChallengeClicked = false;

  ngOnInit(): void {
    this.getDashBoardData();
    if (window.screen.width <= 767) {
      this.mobileScreen = true;
    }

    this.staticPageService.getBannersAndQuotes().subscribe((response) => {
      if (response.quotes.length) {
        this.quotes = response.quotes;
      }
    });
  }

  showLabel(): boolean {
    return this.mobileScreen && this.selectedScreen === this.dashboardScreenMenu[3].value;
  }

  getDashBoardData() {
    this.currentDate = this.xMomentService.defaultTimeWithTimezone('MDT'); //as per tester's(siddesh) comment i changed it.
    // this.currentDate = moment();
    this.userData = this.localStorageService.getUser() || null;
    this.invitedByName =
      this.userData.firstName && this.userData.lastName
        ? this.userData.firstName + ' ' + this.userData.lastName
        : this.userData.firstName
        ? this.userData.firstName
        : this.userData.emailAddress;

    if (!this.userData) {
      this.localStorageService.set(localStorageConstant.redirectTo, `/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`);
      this.router.navigate([`/${authRoutes.main}/${authRoutes.login}`]);
    }

    if (this.userData) {
      this.show.loading = true;
      this.show.pageLoading = true;
      this.getUserExistingChallenge();
    }

    this.route.fragment.subscribe((fragment: string) => {
      if (fragment) {
        this.fragment = fragment;
      } else {
        for (const key in this.show.dashboardScreen) {
          if (this.show.dashboardScreen[key]) {
            this.fragment = key;
            break;
          }
        }
        this.fragment = 'teamstats';
      }
      this.showDashboardScreen(this.fragment);
    });
    this.show.loading = false;
  }

  showActivityModal() {
    const modalRef = this.modalService.open(AddLatestActivityComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'add-activity-modal',
    });

    modalRef.componentInstance.componentData = {
      type: 'team',
      challengeDetails: this.challengeDetail,
      memberDetails: this.existingMember,
    };

    modalRef.componentInstance.emitSuccess.subscribe((activityStreak: number) => {
      if (+this.activityStreak !== activityStreak) {
        this.showBadgeModal(activityStreak);
        modalRef.dismiss();
      } else {
        modalRef.dismiss();
      }
      this.getDashBoardData();
      window.scrollTo(0, 0);
    });
  }

  onDashboardScreenSelect(screenName: string) {
    const headerHeight = $('.main-header').innerHeight();
    $('html, body').animate({
      scrollTop: $('.dashboard-inner').offset().top - headerHeight,
    });
    this.showDashboardScreen(screenName);
  }

  showDashboardScreen(screenName: string) {
    const dashboardScreens = Object.keys(this.show.dashboardScreen);
    screenName = dashboardScreens.includes(screenName) ? screenName : 'dashboard';
    dashboardScreens.forEach((key) => {
      this.show.dashboardScreen[key] = key === screenName;
    });
    if (screenName === 'dashboard') {
      this.show.pageLoading = true;
      this.getUserExistingChallenge();
    }
    this.selectedScreen = screenName;
  }

  getUserExistingChallenge() {
    this.ragnarNationActivity = null;
    this.virtualChallengeDataService.getUserExistingChallenge(this.userData.id).subscribe(
      // tslint:disable-next-line: no-any
      (response: any) => {
        this.challengeDetail = response;
        this.activityStreak = response.activityStreak;
        this.faqs = response.contents.DASHBOARD.faqs;
        this.maxDays = response.maxDays;
        this.remainingPercentage = this.getRemainingDaysAndPercentage(
          response.endDate,
          response.startDate,
          response.maxDays,
          response.completedAt,
          response.activityStreak,
        );
        this.localStorageService.set(localStorageConstant.challenge, JSON.stringify(this.challengeDetail));
        this.startDate = this.xMomentService.convertDateIntoDefaultTime(this.challengeDetail.startDate);
        this.metaTagsServices.setTitle(
          `Ragnar Virtual Challenge | Dashboard | ${this.challengeDetail.name} | ${this.challengeDetail.contents.INFO_PAGE.subTitle}`,
        );
        if (this.challengeDetail.isChallengeCompleted) {
          this.show.result = true;
          this.dashboardScreenMenu = this.dashboardScreenMenu.filter((menu) => this.excludeScreen.indexOf(menu.value) === -1);
          this.virtualChallengeSharedDataService.setDashboardMenu(this.dashboardScreenMenu);
        }
        this.getTeamDetails(this.challengeDetail.challengeTeamId);
        this.getMemberDetails(this.challengeDetail.challengeMemberId);
        this.getRagnarNation();
        this.show.pageLoading = false;
      },
      (error) => {
        if (error && error.status === 404) {
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.home}`]);
        }
        this.show.pageLoading = false;
      },
    );
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
  getRagnarNation() {
    this.virtualChallengeCommunityService.getActivities(this.challengeDetail.id).subscribe(
      (response) => {
        this.ragnarNationActivity = response;
      },
      (error) => {
        console.error('DashboardComponent -> getTeamMemberDetails -> error', error);
      },
    );
  }
  getTeamDetails(teamId: string) {
    /* NOTE: ONLY FOR THE TEAM ENDPOINT */
    this.virtualChallengeTeamDataService.getByid(teamId).subscribe(
      (response: VirtualChallengeTeam & { achieved_run?: number; totalActivities: number }) => {
        this.show.loading = false;
        this.teamDetail = response;
        this.show.isChallengeStarted = true;
        this.getTeamMemberDetails(this.challengeDetail.id, this.teamDetail.id);
        return response;
      },
      (error) => {
        console.error('DashboardComponent -> getTeamDetails -> error', error);
      },
    );
  }
  getTeamMemberDetails(challengeId: string, teamId: string) {
    const filters = {
      filter: `challengeTeamId=${teamId}&filter=challengeId||$eq||${challengeId}`,
    };

    this.virtualChallengeMemberDataService.getAll(filters).subscribe(
      (response) => {
        const streaks = response.map((res: VirtualChallengeMember & { activityStreak: number }) => res.activityStreak);
        this.teamMemberDetail = response;
        this.existingMember = (this.teamMemberDetail || []).find((f) => f.profileId === this.userData.id);
        this.teamActivityStreak = streaks.reduce((prev, curr) => prev + curr);
        return response;
      },
      (error) => {
        console.error('DashboardComponent -> getTeamMemberDetails -> error', error);
      },
    );
  }
  showInviteModal() {
    const modalRef = this.modalService.open(InviteModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'invite-modal',
    });
    modalRef.componentInstance.componentData = {
      type: 'team',
      challengeDetails: this.challengeDetail,
      invitedByEmail: this.invitedByName,
      teamMemberDetail: this.teamMemberDetail,
    };

    modalRef.componentInstance.emitSuccess.subscribe((data: any) => {
      this.getDashBoardData();
      modalRef.dismiss();
    });
  }
  resultSeenUpdate() {
    this.showResults = false;
    this.isCompleteChallengeClicked = true;
    $('body').removeClass('overflow-hidden');
    this.virtualChallengeMemberDataService.updateSeenResult(this.challengeDetail.challengeMemberId).subscribe(
      (response) => {
        this.showResults = false;
      },
      (error) => {
        console.error(error);
      },
    );
  }

  showFaqModal() {
    const modalRef = this.modalService.open(FaqModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'faq-modal',
    });

    modalRef.componentInstance.componentData = {
      title: `Ragnar Challenge`,
      faqs: this.faqs,
    };
  }

  getRemainingDaysAndPercentage(endDate, startDate, maxDays, completedAt, streak) {
    const currentDate = this.xMomentService.defaultTimeWithTimezone('MDT');
    startDate = moment.utc(startDate);
    endDate = moment.utc(endDate);
    if (currentDate >= startDate) {
      this.show.activityButton = true;

      if (currentDate.isAfter(endDate)) {
        this.isChallengeOver = true;
        this.showResults = true;
        if (this.isCompleteChallengeClicked) {
          this.showResults = false;
        }
      }
    } else {
      this.remainingDays = startDate.diff(currentDate, 'days') < 0 ? 0 : startDate.diff(currentDate, 'days') + 1;
      if (this.remainingDays === 0) {
        this.remainingDays = startDate.diff(currentDate, 'm') > 0 ? 1 : 0;
      }
    }

    if (!this.challengeDetail.resultSeen && this.isChallengeOver && this.showResults) {
      $('body').addClass('overflow-hidden');
    }

    return Math.round(100 - (streak * 100) / maxDays);
  }

  changeTeamName(teamName: string, challengeTeamId: string) {
    /* NOTE: ONLY FOR THE TEAM ENDPOINT */

    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      windowClass: 'challenge_progress challenge_rename_team',
    });

    modalRef.componentInstance.componentData = {
      type: 'renameTeam',
      title: 'Rename Team',
      teamDetail: this.teamDetail,
    };

    modalRef.result.then(
      (result) => {
        this.virtualChallengeTeamDataService.changeTeamName(result || teamName, challengeTeamId).subscribe(
          (response) => {
            this.teamDetail.name = result || teamName;
            this.editTeamName = false;
          },
          (error) => {
            console.error(error);
          },
        );
      },
      (reason) => {},
    );
  }

  showBadgeModal(activityStreak) {
    if (this.badgeDays.includes(activityStreak)) {
      const modalRef = this.modalService.open(BadgeAchievementModalComponent, {
        scrollable: true,
        centered: true,
        keyboard: false,
        backdrop: 'static',
        windowClass: 'add-activity-modal badge-modal',
      });

      const index = this.badgeDays.findIndex((e) => +e === activityStreak);
      modalRef.componentInstance.componentData = {
        title: `Ragnar Challenge`,
        badge: { src: `assets/31dc/images/challenge/31_day_2022/badges/badge_${this.badgeDays[index]}.png` },
      };
    }
  }

  deleteMemberReuest(member) {
    /* NOTE: ONLY FOR THE TEAM ENDPOINT */
    this.virtualChallengeMemberDataService.deleteTeamMember(member.id, member.challengeTeamId).subscribe(
      (response) => {
        if (member.role === 'CAPTAIN') {
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.home}`]);
        } else {
          this.getTeamMemberDetails(this.challengeDetail.id, member.challengeTeamId);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }

  deleteMember(member) {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'challenge_progress',
    });

    modalRef.componentInstance.componentData = {
      type: 'deleteMember',
      title: 'Delete Member',
      name: `${member.firstName} ${member.lastName}`,
      existingMember: member,
    };

    modalRef.result.then(
      (data) => {
        if (data === 'cancel') {
          return;
        }
        if (this.existingMember.id !== member.id && member.role === 'MEMBER') {
          this.deleteMemberReuest(member);
        } else if (data && this.existingMember.role === 'MEMBER') {
          this.deleteMemberReuest(member);
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.home}`]);
        } else if (data && this.teamMemberDetail.length > 1 && this.existingMember.role === 'CAPTAIN') {
          this.toastService.show('Member Already Exist delete them first', { classname: 'bg-dark text-light', delay: 3000 });
        } else {
          this.deleteMemberReuest(member);
        }
      },
      (reason) => {},
    );
  }

  nextChallenge() {
    this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.home}`], { queryParams: { next: 'true' } });
  }

  ngOnDestroy(): void {
    $('body').removeClass('overflow-hidden');
  }
  // getRemainingBadges(activityStreak) {
  //   const badges = badgeDays;
  //   for (let index = 0; index < badges.length; index++) {
  //     if (activityStreak >= 31) {
  //       return 0;
  //     } else {
  //       if (activityStreak === badges[index]) {
  //         return badges[index + 1] - activityStreak;
  //       } else if (badges[index] > activityStreak) {
  //         return badges[index] - activityStreak;
  //       }
  //     }
  //   }
  // }
}
