import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LocalStorageService,
  virtualChallengeRoutes,
  authRoutes,
  localStorageConstant,
  MetaTagsService,
  DataLayerService,
} from '@core/utils';
import {
  VirtualChallengeDataService,
  VirtualChallengeTeamDataService,
  VirtualChallengeMemberDataService,
  VirtualChallengeUtilDataService,
  VirtualChallengeNotificationService,
} from '@core/data';
import {
  VirtualChallengeDetail,
  VirtualChallengeTeam,
  VirtualChallengeLeaderBoard,
  VirtualChallengeRunLogs,
  GetChallengeNotification,
  VirtualChallengeMember,
} from '@core/interfaces/virtual-challenge.interface';
import { VirtualChallengeSharedDataService } from '@core/utils/virtual-challenge-shared-data.service';
import { UserInfo } from '@core/interfaces/auth.interface';
import { environment } from 'src/environments/environment';
import * as moment from 'moment-timezone';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModelDialogComponent } from '@components/virtual-challenge/common-model-dialog/common-model-dialog.component';
import { ToastService } from '@components/toast/toast.service';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public dashboardScreenMenu = [
    {
      label: 'Dashboard',
      value: 'dashboard',
      icon: 'iconm-dashbord',
    },
    {
      label: 'Add Run',
      value: 'addRun',
      icon: 'iconm-addrun',
    },
    {
      label: 'Leaderboard',
      value: 'leaderBoard',
      icon: 'iconm-Leaderboard',
    },
    {
      label: 'Invite',
      value: 'invite',
      icon: 'iconm-add-invite',
    },
    {
      label: 'Activity Feed',
      value: 'activityFeed',
      icon: 'iconm-activity-feed',
    },
  ];

  public excludeScreen = ['addRun', 'invite', 'activityFeed'];
  public excludeScreenBeforeStart = ['addRun', 'leaderBoard', 'activityFeed'];
  public excludeScreenAfterStart = ['invite', 'activityFeed'];
  public excludeScreenIfTeam = ['leaderBoard'];
  private notificationInteval;

  public selectedScreen = 'Dashboard';
  public editTeamName = false;

  public show = {
    dashboardScreen: {
      dashboard: true,
      community: false,
      assignLeg: false,
      addRun: false,
      stravaActivity: false,
      teamFeed: false,
      leaderBoard: false,
      invite: false,
      claimLeg: false,
      start: false,
      activityFeed: false,
    },
    result: false,
    isResultComplete: true,
    toast: false,
    loading: false,
    safeText: `You’re Not Safe!`,
    remaining: {
      totalDays: null,
      days: null,
      hours: null,
    },
    runToSafe: 0,
    isChallengeStarted: false,
    showGreetingsModal: true,
    isDashboardScreenSet: false,
  };

  public challengeDetail: VirtualChallengeDetail;
  public teamDetail: VirtualChallengeTeam & { achieved_run?: number };
  public teamMemberDetail: VirtualChallengeMember[];
  public existingMember: VirtualChallengeMember;
  public leaderBoardDetail: VirtualChallengeLeaderBoard;
  public runLogs: VirtualChallengeRunLogs[];

  public userData: UserInfo = null;
  public invitedByName = '';

  public curruntURL = null;

  public virtualChallengeRoutes = virtualChallengeRoutes;
  public editActivityCopy;

  private isComponentInit = false;

  private greetingModal;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private toastService: ToastService,
    private localStorageService: LocalStorageService,
    private virtualChallengeSharedDataService: VirtualChallengeSharedDataService,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private virtualChallengeTeamDataService: VirtualChallengeTeamDataService,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    private virtualChallengeUtilDataService: VirtualChallengeUtilDataService,
    private metaTagsServices: MetaTagsService,
    private virtualChallengeNotificationService: VirtualChallengeNotificationService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'virtual-challenge-dashboard',
      pagePostType: 'virtualChallengeDashboard',
      pagePostType2: 'single-page',
    });
    this.curruntURL = this.router.url;

    this.userData = this.localStorageService.getUser() || null;
    this.invitedByName =
      this.userData.firstName && this.userData.lastName
        ? this.userData.firstName + ' ' + this.userData.lastName
        : this.userData.firstName
        ? this.userData.firstName
        : this.userData.emailAddress;

    if (!this.userData) {
      this.show.loading = true;
      this.localStorageService.set(localStorageConstant.redirectTo, `/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`);
      this.router.navigate([`/${authRoutes.main}/${authRoutes.login}`]);
    }

    if (this.userData) {
      this.show.loading = true;
      this.getUserExistingChallenge();
    }

    this.route.fragment.subscribe((fragment: string) => {
      if (fragment && !this.show.dashboardScreen[fragment]) {
        this.showDashboardScreen(fragment);
      }
    });

    this.route.queryParams.subscribe((params) => {
      if (params.code && params.scope) {
        this.connectToStravaUserProfile(params.code);
      }
    });

    this.virtualChallengeSharedDataService.getNotifications().subscribe((response) => {
      if (response === false) {
        this.getNotifications();
      }
    });
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

  onDashboardScreenSelect(screenName: string) {
    this.showDashboardScreen(screenName);
  }

  showDashboardScreen(screenName: string) {
    const dashboardScreens = Object.keys(this.show.dashboardScreen);
    screenName = dashboardScreens.includes(screenName) ? screenName : 'dashboard';
    dashboardScreens.forEach((key) => {
      this.show.dashboardScreen[key] = key === screenName;
    });
    if (screenName === 'dashboard') {
      this.getUserExistingChallenge();
    }
    this.selectedScreen = screenName;
  }

  getUserExistingChallenge() {
    this.virtualChallengeDataService.getUserExistingChallenge(this.userData.id).subscribe(
      (response) => {
        this.challengeDetail = response;
        this.metaTagsServices.setTitle(
          `Ragnar Virtual Challenge | Dashboard | ${this.challengeDetail.name} | ${this.challengeDetail?.contents?.INFO_PAGE?.subTitle}`,
        );
        if (this.challengeDetail.isChallengeCompleted) {
          this.show.result = true;
          this.dashboardScreenMenu = this.dashboardScreenMenu.filter((menu) => this.excludeScreen.indexOf(menu.value) === -1);
          this.virtualChallengeSharedDataService.setDashboardMenu(this.dashboardScreenMenu);
          this.getMemberDetails(this.challengeDetail.challengeMemberId);
        }

        if (this.challengeDetail.challengeType === 'TEAM') {
          this.getTeamDetails(this.challengeDetail.challengeTeamId);
          this.getRunLogs();
        } else {
          this.getNotifications();
          if (!this.show.result) {
            this.notificationInteval = setInterval(() => {
              this.getNotifications();
            }, 360000);
          }
          this.calculateRemainingDaysAndHours();
          this.getLeaderBoardData(null);
          this.getRunLogs();
        }
      },
      (error) => {
        if (error && error.status === 404) {
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.home}`]);
        }
      },
    );
  }

  getLeaderBoardData($event) {
    this.virtualChallengeDataService
      .getLeaderBoardData(this.challengeDetail.id, this.challengeDetail.challengeMemberId, false, true)
      .subscribe((response) => {
        this.leaderBoardDetail = response;
        this.calculateSafeState();
        this.calculateMilesRunToBecomeSafe();
        this.checkGreeting();
        this.show.loading = false;
        if ($event && ($event.type === 'addedRun' || $event.type === 'updatedRunAfterAdd' || $event.type === 'updatedRunFromEdit')) {
          if ($event.type === 'updatedRunFromEdit' && this.challengeDetail.challengeType === 'TEAM') {
            this.teamDetail.achieved_run = this.teamDetail.achieved_run - $event.addedActivity.prevMile;
          }
          if ($event.type === 'deletedRun' && this.challengeDetail.challengeType === 'TEAM') {
            this.teamDetail.achieved_run = this.teamDetail.achieved_run - $event.addedActivity.unit;
          }
          this.getUserExistingChallenge();
          this.showChallengeProgress($event);
          this.getRunLogs();
        }
      });
  }

  calculateSafeState() {
    if (this.leaderBoardDetail.existingMember.currentSafeStatus === 'NOT_SAFE') {
      this.show.safeText = `You are <strong>NOT SAFE.</strong>  Running another ${this.leaderBoardDetail.avgRun} miles by ${moment
        .utc(this.challengeDetail.endDate)
        .format('dddd')} just might improve your fate.`;
      this.leaderBoardDetail.safeState = 'NOT';
    } else if (this.leaderBoardDetail.existingMember.currentSafeStatus === 'MAYBE_SAFE') {
      this.show.safeText = `You are <strong>MAYBE SAFE.</strong>  Running another ${this.leaderBoardDetail.avgRun} miles by ${moment
        .utc(this.challengeDetail.endDate)
        .format('dddd')} might keep you kind of safe.`;
      this.leaderBoardDetail.safeState = 'MAYBE';
    } else if (this.leaderBoardDetail.existingMember.currentSafeStatus === 'SAFE') {
      this.show.safeText = `You are <strong>PROBABLY SAFE.</strong>  Running another ${this.leaderBoardDetail.avgRun} miles by ${moment
        .utc(this.challengeDetail.endDate)
        .format('dddd')} might help you preserve your lead.`;
      this.leaderBoardDetail.safeState = 'LIKELY';
    }
  }

  calculateMilesRunToBecomeSafe() {
    const safeRunAvg = (this.leaderBoardDetail.maxRun * 70) / 100;
    this.show.runToSafe = 0;
    if (this.leaderBoardDetail.safeState === 'NOT' && this.leaderBoardDetail.myRun < safeRunAvg) {
      this.show.runToSafe = parseFloat(this.leaderBoardDetail.rankPocessedData.SAFE.currently.replace('+', '')) + 0.1;
    }
  }

  calculateRemainingDaysAndHours() {
    const clonedDashboardScreen = cloneDeep(this.dashboardScreenMenu);
    this.calculateDayAndTime(clonedDashboardScreen);
    setInterval(() => {
      this.calculateDayAndTime(clonedDashboardScreen);
    }, 1000);
  }

  calculateDayAndTime(clonedDashboardScreen) {
    const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
    const endDate = this.teamDetail && this.teamDetail.endDate ? moment(this.teamDetail.endDate) : moment(this.challengeDetail.endDate);
    const startDate =
      this.teamDetail && this.teamDetail.startDate ? moment(this.teamDetail.startDate) : moment(this.challengeDetail.startDate);
    const days = today.diff(startDate, 'days') + 1;
    if (today.isAfter(startDate)) {
      this.show.isChallengeStarted = true;
    }
    if (!this.show.isChallengeStarted) {
      this.dashboardScreenMenu = this.dashboardScreenMenu.filter((menu) => this.excludeScreenBeforeStart.indexOf(menu.value) === -1);
      this.virtualChallengeSharedDataService.setDashboardMenu(this.dashboardScreenMenu);
      this.show.isDashboardScreenSet = true;
    } else if (!this.isComponentInit && this.challengeDetail.challengeType !== 'TEAM') {
      this.isComponentInit = true;
      this.dashboardScreenMenu = this.dashboardScreenMenu.filter((menu) => this.excludeScreenAfterStart.indexOf(menu.value) === -1);
      this.virtualChallengeSharedDataService.setDashboardMenu(this.dashboardScreenMenu);
    } else if (!this.isComponentInit && this.challengeDetail.challengeType === 'TEAM') {
      this.isComponentInit = true;
      this.dashboardScreenMenu = this.dashboardScreenMenu.filter((menu) => this.excludeScreenIfTeam.indexOf(menu.value) === -1);
      this.virtualChallengeSharedDataService.setDashboardMenu(this.dashboardScreenMenu);
    }
    if (this.show.isChallengeStarted && this.show.isDashboardScreenSet) {
      this.show.isDashboardScreenSet = false;
      this.dashboardScreenMenu = clonedDashboardScreen;
      this.virtualChallengeSharedDataService.setDashboardMenu(false);
    }

    this.show.remaining.totalDays = endDate.diff(startDate, 'days') + 1;
    // this.show.remaining.totalDays = endDate.diff(startDate, 'days');
    this.show.remaining.days = days > this.challengeDetail.maxDays ? this.challengeDetail.maxDays : days;
    this.show.remaining.hours = endDate.diff(today, 'hours') > 0 ? endDate.diff(today, 'hours') : 0;
    if (days > this.challengeDetail.maxDays) {
      this.show.showGreetingsModal = false;
      this.localStorageService.remove(localStorageConstant.virtualChallengeGreetinModal);
    }
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

  showChallengeProgress($event) {
    const message = [
      'According to bigfootfinder.com, Bigfoot stands between 6 ft. 6 in. and 10 ft. tall, weighing between 400 and 1,000 pounds. His fur is reddish or dark brown, and is described as “unkempt, matted.” He has a distinct odor.',
      'The Bigfoot Field Researchers Organization lists at least one report of a Bigfoot sighting from every state in the U.S. except Hawaii.',
      'About one-third of all claims of Bigfoot sightings are located in the Pacific Northwest, with the remaining reports spread throughout the rest of North America.',
      'The most recent Bigfoot sighting, in June 2018, was by a woman in Florida who reported a creature that looked like “a large pile of soggy grass.”',
      'The FBI has had a file on Bigfoot since 1976, when they analyzed a hair sample at the request of a Bigfoot researcher. The verdict? It was from a deer.',
      'Skamania County, Washington, considers itself a Bigfoot refuge, and a 1984 ordinance states that killing this “endangered” ape-like creature can get you a year in jail, a $1,000 fine or both.',
      `Guess who said this? “Well now you will be amazed when I tell you that I'm sure that they exist.” None other than famed primatologist Jane Goodall, in an interview with NPR.`,
      'Look for Bigfoot crossing signs near Richardson’s Grove State Park in Northern California and on Pike’s Peak Highway in Colorado.',
      'The infamous footprints found near Bluff Creek in Northern California in 1958, which transformed the Bigfoot myth into a media sensation, were created by a man named Ray Wallace. The prank wasn’t revealed until after his death in 2002.',
      'Bigfoot is also known as Sasquatch, an adaptation of the Coast Salish word “Sesquac,” which means “wild man.” In total, the Native American tribes of North America have more than sixty different names for Sasquatch.',
      'Appalachia’s version of Bigfoot is called Midnight Whistler. He’s 6 ft. to 7 ½ ft. tall with jet black fur and glowing green eyes, and he emits a booming whistle that sounds like a steam engine.',
      'Researchers report that one type of Bigfoot has a particular fondness for Golden Delicious apples, and they like to make their homes near these orchards.',
      'To report a bigfoot sighting—or that telltale stench—call the Bigfoot Research Project at 1-800-BIGFOOT or 503-352-7000.',
    ];
    window.location.hash = 'dashboard';
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'challenge_progress',
    });
    if ($event.type !== 'deletedRun' && this.challengeDetail.challengeType === 'TEAM') {
      this.teamDetail.achieved_run = (this.teamDetail.achieved_run || 0) + ($event.addedActivity.unit || 0);
    }
    modalRef.componentInstance.componentData = {
      type: 'challengeProgress',
      title: 'Challenge Progress',
      progressDetails: this.leaderBoardDetail,
      addedActivity: $event.addedActivity || null,
      teamDetail: this.teamDetail,
      existingMember: this.existingMember,
      challengeDetail: this.challengeDetail,
      message: message[Math.floor(Math.random() * message.length)],
    };

    modalRef.result.then(
      (result) => {
        if (result && result === 'edit') {
          window.location.hash = 'addRun';
          this.editActivityCopy = $event;
          this.teamDetail.achieved_run = this.teamDetail.achieved_run - $event.addedActivity.unit;
        } else {
          this.editActivityCopy = null;
          window.location.hash = 'dashboard';
        }
      },
      (reason) => {},
    );
  }

  getRunLogs() {
    const filters = {
      // tslint:disable-next-line: max-line-length
      filter: `filter=challengeId||$eq||${this.challengeDetail.id}&filter=challengeMemberId||$eq||${this.challengeDetail.challengeMemberId}`,
      sort: 'sort=logDate,DESC',
    };
    this.virtualChallengeUtilDataService.getActivities(filters).subscribe(
      (runLogs) => {
        this.runLogs = this.virtualChallengeSharedDataService.checkRunLogs(runLogs);
      },
      (error) => {},
    );
  }

  getLogsAndLeaderBoard() {
    if (this.challengeDetail.challengeType !== 'TEAM') {
      this.getLeaderBoardData(null);
    }
    this.getRunLogs();
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

  checkGreeting() {
    this.greetingModal = this.localStorageService.get(localStorageConstant.virtualChallengeGreetinModal) || null;
    if (
      this.show.isChallengeStarted &&
      this.show.showGreetingsModal &&
      (!this.greetingModal || this.greetingModal !== this.show.remaining.days)
    ) {
      this.showGreetingsModal();
      this.localStorageService.set(localStorageConstant.virtualChallengeGreetinModal, this.show.remaining.days);
    }
  }

  showGreetingsModal() {
    const message = {
      2: {
        NOT: `Uh-oh, you’re <strong>Not Safe</strong>. Better pick up the pace today.`,
        MAYBE: `Keep up the good work. You’re definitely <strong>Maybe Safe</strong> from Big Foot.`,
        LIKELY: `Yass! Your miles put you at the front of the pack. You are <strong>Probably Safe</strong>.`,
      },
      3: {
        NOT: `Do you feel that foul breath on your neck? Sorry, you’re <strong>Not Safe</strong> today.`,
        MAYBE: `You’re solidly in the middle of the pack. Congrats, you’re <strong>Maybe Safe</strong>!`,
        LIKELY: `You’ve left Big Foot in the dust. Well done! You’re <strong>Probably Safe</strong>. (For now.)`,
      },
      4: {
        NOT: `Big Foot is getting closer… and you are <strong>Not Safe</strong>. Run!`,
        MAYBE: `Big Foot is getting closer…and you are <strong>Maybe Safe</strong>. Run!`,
        LIKELY: `Big Foot is getting closer…and you are <strong>Probably Safe</strong>. Well done!`,
      },
      5: {
        NOT: `You’re <strong>Not Safe</strong>. This is your last chance to defeat the beast!`,
        MAYBE: `You’re <strong>Maybe Safe</strong>. This is your last chance to stay that way!`,
        LIKELY: `You’re <strong>Probably Safe</strong>. Better log some miles to keep your lead!`,
      },
    };

    const currentDayMessage =
      this.show.remaining.days > 1
        ? message[this.show.remaining.days]
          ? message[this.show.remaining.days][this.leaderBoardDetail.safeState]
          : 'Goooooooo!'
        : 'Goooooooo!';

    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'virtual_greeting',
    });

    modalRef.componentInstance.componentData = {
      type: 'virtualGreetings',
      title: `Day ${this.show.remaining.days}`,
      details: {
        name: this.challengeDetail.name,
        image: this.challengeDetail.contents.INFO_PAGE.logo,
        day: currentDayMessage,
      },
    };
  }

  copyLink() {
    const url = `${location.origin}${environment.BASE_URL}${virtualChallengeRoutes.main}/${virtualChallengeRoutes.publicShare}/${this.userData.id}`;

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

  getNotifications() {
    const filter = {
      // tslint:disable-next-line: max-line-length
      filter: `filter=challengeId||$eq||${this.challengeDetail.id}&filter=challengeMemberId||$eq||${this.challengeDetail.challengeMemberId}`,
      sort: `sort=insertedOn,DESC`,
    };
    const NEG_MAYBE_SAFE_MESSAGE = [
      'Uh-oh, looks like the big guy is gaining on you. Can you squeeze in an extra run today?',
      'You’re falling behind. Are you ready to get that monkey off your back?',
    ];

    const NEG_NOT_SAFE_MESSAGE = [
      'Being Bigfoot bait is a tough job, but somebody has to do it. Thank you for your service.',
      'Thanks for taking one for the team. As long as you’re Not Safe, someone else will be!',
    ];

    const POS_MAYBE_SAFE_MESSAGE = [
      'You did it! You totally could be kind of safe, for now.',
      'You’re moving on up! Spare a thought for the Bigfoot bait you left in your wake.',
    ];

    const SAFE_MESSAGE = [
      'You win some, you lose some. (But you’re sure winning this one!)',
      'Ha! Look at all those runners you left in the dust! (Really look, because you may never see them again.)',
    ];
    this.virtualChallengeNotificationService.getNotifications(filter).subscribe(
      (notifications: GetChallengeNotification[] & { totalUnRead?: number; challengeMemberId?: string; logo?: string }) => {
        if (notifications.length) {
          let unRead = 0;
          notifications = notifications.map((notification) => {
            const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
            const insertedOn = moment(notification.insertedOn);
            const minutes = today.diff(insertedOn, 'minutes');
            const hours = today.diff(insertedOn, 'hours');
            const days = today.diff(insertedOn, 'days');

            notification.insertedOn = days ? `${days}D ago` : hours ? `${hours}H ago` : `${minutes}M ago`;

            if (notification.type === 'STATE_CHANGE') {
              notification = this.setNotificationStateInDigit(notification);
              switch (notification.currentStatus) {
                case 'SAFE':
                  notification.message = SAFE_MESSAGE[Math.floor(Math.random() * SAFE_MESSAGE.length)];
                  break;
                case 'MAYBE_SAFE':
                  if (notification.previousStatusDigit < notification.currentStatusDigit) {
                    notification.message = NEG_MAYBE_SAFE_MESSAGE[Math.floor(Math.random() * NEG_MAYBE_SAFE_MESSAGE.length)];
                  } else if (notification.previousStatusDigit > notification.currentStatusDigit) {
                    notification.message = POS_MAYBE_SAFE_MESSAGE[Math.floor(Math.random() * POS_MAYBE_SAFE_MESSAGE.length)];
                  } else {
                    notification.message = `You're likely safe in ${this.challengeDetail.name}!`;
                  }
                  break;
                case 'NOT_SAFE':
                  if (notification.previousStatusDigit < notification.currentStatusDigit) {
                    notification.message = NEG_NOT_SAFE_MESSAGE[Math.floor(Math.random() * NEG_NOT_SAFE_MESSAGE.length)];
                  } else {
                    notification.message = `Uh oh! You're no longer safe in ${this.challengeDetail.name}!`;
                  }
                  break;
                default:
                  break;
              }
            } else if (notification.type === 'EVENT_STARTED') {
              notification.message = `On your mark, get set, run from that oversized bipedal hominid!`;
            } else if (notification.type === 'EVENT_ABOUT_END') {
              notification.message = `Last day to add distance. Will you catch up? Preserve your lead? Or be left in the dust?`;
            } else if (notification.type === 'REGULAR_DAY_UPDATE') {
              switch (notification.currentStatus) {
                case 'SAFE':
                  notification.message = `You're probably safe in ${this.challengeDetail.name}!`;
                  break;
                case 'MAYBE_SAFE':
                  notification.message = `You're likely safe in ${this.challengeDetail.name}!`;
                  break;
                case 'NOT_SAFE':
                  notification.message = `Uh oh! You're no longer safe in ${this.challengeDetail.name}!`;
                  break;
                default:
                  break;
              }
            }

            if (!notification.isRead) {
              unRead++;
            }

            return notification;
          });
          notifications.totalUnRead = unRead;
          notifications.challengeMemberId = this.challengeDetail.challengeMemberId;
          notifications.logo = this.challengeDetail.contents.INFO_PAGE.logo;
          this.virtualChallengeSharedDataService.setNotifications(notifications);
        } else {
          notifications.totalUnRead = 0;
          this.virtualChallengeSharedDataService.setNotifications(notifications);
        }
      },
      (err) => {
        clearInterval(this.notificationInteval);
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

  setNotificationStateInDigit(notification) {
    if (notification.previousStatus) {
      switch (notification.previousStatus) {
        case 'SAFE':
          notification.previousStatusDigit = 1;
          break;
        case 'MAYBE_SAFE':
          notification.previousStatusDigit = 2;
          break;
        case 'NOT_SAFE':
          notification.previousStatusDigit = 3;
          break;
        default:
          break;
      }
    } else if (notification.currentStatus) {
      switch (notification.currentStatus) {
        case 'SAFE':
          notification.currentStatusDigit = 1;
          break;
        case 'MAYBE_SAFE':
          notification.currentStatusDigit = 2;
          break;
        case 'NOT_SAFE':
          notification.currentStatusDigit = 3;
          break;
        default:
          break;
      }
    }
    return notification;
  }

  getTeamDetails(teamId: string) {
    /* NOTE: ONLY FOR THE TEAM ENDPOINT */
    this.virtualChallengeTeamDataService.getByid(teamId).subscribe(
      (response) => {
        this.show.loading = false;
        this.teamDetail = response;
        this.show.isChallengeStarted = true;
        this.calculateRemainingDaysAndHours();
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
      filter: `&filter=challengeId||$eq||${challengeId}&filter=challengeId||$eq||${teamId}&challengeTeamId=${teamId}`,
    };

    this.virtualChallengeMemberDataService.getAll(filters).subscribe(
      (response) => {
        this.teamMemberDetail = response;
        this.existingMember = (this.teamMemberDetail || []).find((f) => f.profileId === this.userData.id);
        return response;
      },
      (error) => {
        console.error('DashboardComponent -> getTeamMemberDetails -> error', error);
      },
    );
  }

  connectToStravaUserProfile(authorizationCode) {
    const data = {
      client_id: environment.STRAVA.CLIENT_ID,
      client_secret: environment.STRAVA.CLIENT_SECRET,
      code: authorizationCode,
      grant_type: 'authorization_code',
    };

    this.router.navigate(['.'], { relativeTo: this.route, queryParams: {}, replaceUrl: true });

    this.virtualChallengeUtilDataService.connectToStravaProfile(data).subscribe((response) => {
      this.userData.stravaUserDetail = response;
      this.localStorageService.set(localStorageConstant.profilesUser, this.userData);
      this.showDashboardScreen('addRun');
    });
  }
}
