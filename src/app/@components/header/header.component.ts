import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
import * as moment from 'moment-timezone';
import { TranslateService } from '@ngx-translate/core';
import { RagnarCMSDataService, RCMSEventDataService, VirtualChallengeDataService } from 'src/app/@core/data';
import { DashboardBehviourSubject } from 'src/app/@core/interfaces/virtual-challenge.interface';
import { authRoutes, virtualChallengeRoutes, headerRoutes, RACE_CONFIG, LocalStorageService, VirtualChallengeSharedDataService, DataLayerService, localStorageConstant, registrationRoutes } from 'src/app/@core/utils';
import { CommonModelDialogComponent } from '../virtual-challenge/common-model-dialog/common-model-dialog.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChildren(NgbDropdown) dropdowns: QueryList<NgbDropdown>;
  public authRoutes = authRoutes;
  public virtualChallengeRoutes = virtualChallengeRoutes;
  public headerRoutes = headerRoutes;
  public virtualChallengeNav: DashboardBehviourSubject[] = [
    {
      label: 'Dashboard',
      value: 'dashboard',
    },
    {
      label: 'Leaderboard',
      value: 'leaderBoard',
    },
    {
      label: 'Invite',
      value: 'invite',
    },
    {
      label: 'Add Run',
      value: 'addRun',
    },
    {
      label: 'Activity Feed',
      value: 'activityFeed',
    },
  ];

  public fragmentToLabel = {
    teamstats: 'Team Stats',
    activityFeed: 'Activity Feed',
    newinvite: 'New Invite',
    ragnarnation: 'Ragnar Nation',
  };

  public selectedVirtualChallengeNav = 'Dashboard';

  public userData = null;

  public show = {
    virtualNav: false,
    profileOption: false,
    mobileNav: false,
    dcNav: false,
  };

  public regions = RACE_CONFIG.regions;

  public virtualChallengeNotifications;

  public virtualChallengePeriod = 'REGISTER';
  private inputFocusCount = 0;
  public newsLetterEmail = '';

  public dashboardFragment = 'teamstats';

  declare dcStartDate: object;
  declare dcEndDate: object;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
    private virtualChallengeSharedDataService: VirtualChallengeSharedDataService,
    private ragnarCmsDataService: RagnarCMSDataService,
    private translate: TranslateService,
    private rcmsEventDataService: RCMSEventDataService,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    const clonedVirtualChallengeNav = cloneDeep(this.virtualChallengeNav);
    this.virtualChallengeSharedDataService.getDashboardMenu().subscribe((response: DashboardBehviourSubject) => {
      if (response && response.exclude) {
        this.virtualChallengeNav = this.virtualChallengeNav.filter((menu) => response.exclude !== menu.value);
      } else if (response) {
        this.virtualChallengeNav = response as DashboardBehviourSubject[];
      } else {
        // this.virtualChallengeNav = clonedVirtualChallengeNav;
      }
    });

    this.virtualChallengeSharedDataService.getUserData().subscribe((response) => {
      if (response) {
        this.setUserData();
      }
    }); 

    this.route.fragment.subscribe((fragment: string) => {
      this.show.virtualNav = this.router.url.includes(`/${virtualChallengeRoutes.dashboard}`);
      if (fragment && this.show.virtualNav) {
        this.selectedVirtualChallengeNav = this.virtualChallengeNav.find((menu) => menu.value === fragment).label;
      }
    });

    this.route.fragment.subscribe((fragment: string) => {
      if (fragment && fragment.length > 0 && Object.keys(this.fragmentToLabel).includes(fragment)) {
        this.dashboardFragment = fragment;
      }
    });

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.show.virtualNav = this.router.url.includes(`/${virtualChallengeRoutes.dashboard}`);
      }
    });

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.show.dcNav = this.router.url.includes(`/${virtualChallengeRoutes.DcDashboard}`);
      }
    });

    this.virtualChallengeSharedDataService.getNotifications().subscribe((response) => {
      if (response) {
        this.virtualChallengeNotifications = response;
      }
    });

    this.setUserData();
    this.getRaces();
    // this.setVirtualChallengePeriod();
    this.translate.setDefaultLang('en');
  }

  onDashboardScreenChange(screenName: string) {
    window.location.hash = screenName;
  }

  setUserData() {
    this.userData = this.localStorageService.getUser();
  }

  logout() {
    this.localStorageService.flushAll();
    this.userData = null;
    this.rcmsEventDataService.clearUserEventCache();
    this.virtualChallengeNotifications = [];
    this.router.navigate([`/`]);
  }

  showNotifications() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'notification_head',
    });

    modalRef.componentInstance.componentData = {
      type: 'notification',
      title: 'Notifications',
      notificationsData: this.virtualChallengeNotifications,
    };
  }
  openMenu() {
    this.show.mobileNav = !this.show.mobileNav;
    if (this.show.mobileNav) {
      const header = document.getElementsByClassName('site-header')[0];
      if (header) {
        header.classList.remove('sticky-header');
      }
    } else {
      const header = document.getElementsByClassName('site-header')[0];
      if (header) {
        header.classList.add('sticky-header');
      }
    }
  }
  getRaces() {
    this.ragnarCmsDataService.getRaces().subscribe((events) => {
      // const data = JSON.stringify(events)
      Object.keys(RACE_CONFIG.regions).forEach((regionKey) => {
        this.regions[regionKey] = events.data.fetchRaceList
          .filter((x) => {
            if (x.name.toLowerCase().includes('porsche')) {
              x.type = 'track';
            }
            return x.region === RACE_CONFIG.regions[regionKey];
          })
          .sort((a, b) => (a.coming_soon === b.coming_soon ? 0 : a ? -1 : 1))
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
      });
    });
  }

  redirectToURL(url, routeFlag) {
    this.show.mobileNav = false;
    routeFlag ? this.router.navigateByUrl(`/${url}`) : window.open(url, '_blank');
  }

  setVirtualChallengePeriod() {
    // TODO: VC2-119

    this.virtualChallengeDataService.getVirtualChallengeDates().subscribe((data) => {
      const dcData = data.find((challenge) => challenge.name === '31 Day Challenge');
      if (dcData) {
        this.dcStartDate = moment(moment(dcData.startDate.split('T')[0]).format('YYYY-MM-DD'))
          .set({ hour: 0, minute: 0, seconds: 1 })
          .utc();
        this.dcEndDate = moment(moment(dcData.endDate.split('T')[0]).format('YYYY-MM-DD'))
          .set({ hour: 23, minute: 59, seconds: 58 })
          .utc();
      } else {
        this.virtualChallengePeriod = 'FINISHED';
      }
    });

    setInterval(() => {
      const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
      const startDate = moment(
        moment.tz(moment(this.dcStartDate).utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
      ).utc();
      const endDate = moment(moment.tz(moment(this.dcEndDate).utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
      if (today.isAfter(startDate)) {
        this.virtualChallengePeriod = 'STARTED';
      }
      if (today.isAfter(endDate)) {
        this.virtualChallengePeriod = 'FINISHED';
      }
    }, 1000);
  }

  closeDropDown(event) {
    if (event) {
      this.dropdowns.toArray().forEach((el) => {
        el.close();
      });
    }
    this.show.mobileNav = false;
  }
  loginWithRedirection() {
    const isRediretToVC = window.location.pathname === '/challenge/info' && window.location.href?.split('?')[1]?.includes('challengeId');
    const params = window.location.href?.split('?')[1]?.split('&');
    if (params) {
      const challengeId = params[0]?.split('=')[1];
      const challengeTeamId = params[1]?.split('=')[1];
      if (isRediretToVC) {
        this.localStorageService.set(
          localStorageConstant.redirectTo,
          `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${challengeId}/${registrationRoutes.personalInfo}`,
        );
        this.localStorageService.set('challengeTeamId', challengeTeamId);
      }
    }

    this.router.navigate([`/${this.authRoutes.main}/${this.authRoutes.login}`]);
    this.show.mobileNav = false;
  }
  formElementEnter() {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'news-letter',
        email: this.newsLetterEmail,
      });
    }
  }
  formElementExit() {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'news-letter',
      email: this.newsLetterEmail,
    });
  }
}
