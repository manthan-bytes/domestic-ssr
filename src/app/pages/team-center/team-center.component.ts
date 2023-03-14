import { Component, Inject, ElementRef, OnInit, Renderer2, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import lodashFilter from 'lodash/filter';
import { forkJoin } from 'rxjs';
import { RCMSEventDataService } from '@core/data/rcms-services/rcms-event.service';
import { RcmsEventDetail, ClassificationAndDivision, Glampings } from '@core/interfaces/rcms-event-details.interface';
import { XMomentService, LocalStorageService, DataLayerService } from '@core/utils';
import { TeamAndRunnerInformation, InvitedUser } from '@core/interfaces/rcms-team-runner-information.interface';
import { ProfileRcmsDataService, RagnarCMSDataService } from '@core/data';
import { UserInfo } from '@core/interfaces/auth.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DigitalCheckInComponent } from './dialog/digital-check-in/digital-check-in.component';
import { teamcenterDataField } from '@core/graphql/graphql';
import { TeamCenterInterface } from '@core/interfaces/team-center-data.interface';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@components/toast/toast.service';
import * as $ from 'jquery';
import { MyRunnerData } from '@core/interfaces/my-runner-data.interface';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-team-center',
  templateUrl: './team-center.component.html',
  styleUrls: ['./team-center.component.scss'],
})
export class TeamCenterComponent implements OnInit, OnDestroy {
  public show = {
    pageLoading: false,
    dataLoading: false,
    activeTab: 'Team_Details',
    activeEvent: false,
    notRegisterMessage: false,
    notRegisterBody: 'Team Center will become available when you register for a team!',
    noEventRegisterd: false,
    glampingAd: false,
    isCaptain: false,
    showMultiEventPopup: false,
  };
  public isShowUpcomingEventPrevBtn = '';
  public isFromGlamping = false;

  public eventData = {
    ongoing: [],
    past: [],
    cmsEvent: null,
    classifications: [],
    divsions: [],
    legs: [],
  };

  public selected = {
    ongoingTabIndex: 0,
    pastTabIndex: 0,
    event: null,
  };

  public information = {
    team: null,
    captain: null,
    runners: null,
    volunteers: null,
    invite: null,
  };
  myRunnerData: MyRunnerData;
  isAllRunnerCheckin: boolean;
  runnerSection: boolean;
  captainSection: boolean;
  activeRunnerTab = 1;
  activeCaptainTab = 1;

  public profileImages = [];
  public raceData = [];
  public legsData = [];
  public script;

  public tabConfig = {
    teamDetail: {
      editOption: false,
      onSaveLoadingBar: false,
    },
    roster: {
      deleteRunner: false,
      onResendLoadingBar: [],
    },
    volunteer: {
      deleteVolunteer: false,
      onResendLoadingBar: [],
    },
    checkIn: {
      showCheckingStatus: false,
      showSorryMsg: false,
      isCheckedSafety: false,
    },
  };
  glampingCount: Glampings;
  eventId: string;
  divisionBackup: ClassificationAndDivision[];
  classificationBackup: ClassificationAndDivision[];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rcmsEventDataService: RCMSEventDataService,
    private xMomentService: XMomentService,
    private localStorageService: LocalStorageService,
    private profileRcmsDataService: ProfileRcmsDataService,
    private ragnarCmsDataService: RagnarCMSDataService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private myElement: ElementRef,
    private toastService: ToastService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private dataLayerService: DataLayerService,
    @Inject(PLATFORM_ID) private platformId:Object
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'team-center',
      pagePostType: 'teamCenter',
      pagePostType2: 'single-page',
    });
    this.script = this.renderer2.createElement('script');
    this.script.text = `
    (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:2618093,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
  `;

    this.renderer2.appendChild(this.document.body, this.script);
    this.eventId = this.getURLParameter('event');
    this.router.navigateByUrl('/teamcenter');
    this.router.navigate([], {
      queryParams: { event: this.eventId },
      queryParamsHandling: 'preserve', // remove to replace all query params by provided
    });
    this.getUserEvents(this.eventId);
    this.subscribeToRouteChanges();
    this.translate.setDefaultLang('en');
    if (this.eventId) {
      const interval = setInterval(() => {
        const ele = this.myElement.nativeElement.getElementsByClassName(this.eventId);
        const parentEle = this.myElement.nativeElement.getElementsByClassName('upcoming-events');
        if (ele.length > 0) {
          parentEle[0].scrollTo({ left: parentEle[0].scrollLeft + ele[0].offsetLeft + 30, behavior: 'smooth' });
          clearInterval(interval);
        }
      }, 2000);
    }
  }
  ngOnDestroy() {
    this.renderer2.removeChild(this.document.body, this.script);
  }
  private subscribeToRouteChanges() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment && this.router.url.includes('teamcenter')) {
        this.switchTab(fragment);
      } else if (!fragment && this.router.url.includes('teamcenter')) {
        this.switchTab('Team_Details');
      }
    });
  }

  switchTab(tab) {
    this.tabConfig.teamDetail = {
      editOption: false,
      onSaveLoadingBar: false,
    };
    this.tabConfig.roster = {
      deleteRunner: false,
      onResendLoadingBar: [],
    };
    this.tabConfig.volunteer = {
      deleteVolunteer: false,
      onResendLoadingBar: [],
    };
    this.tabConfig.checkIn = {
      showCheckingStatus: false,
      showSorryMsg: false,
      isCheckedSafety: false,
    };
    this.show.activeTab = tab;
    if(isPlatformBrowser(this.platformId)){
      window.location.hash = tab;
    }
    if (tab === 'Team_Details' && this.selected.event) {
      this.selectEvent(this.selected.event, this.show.activeEvent, true);
    }
  }

  resetConfig() {
    this.tabConfig.teamDetail = {
      editOption: false,
      onSaveLoadingBar: false,
    };
    this.tabConfig.roster = {
      deleteRunner: false,
      onResendLoadingBar: [],
    };
    this.tabConfig.volunteer = {
      deleteVolunteer: false,
      onResendLoadingBar: [],
    };
    this.tabConfig.checkIn = {
      showCheckingStatus: false,
      showSorryMsg: false,
      isCheckedSafety: false,
    };

    this.information.invite = [];
    this.profileImages = [];
  }

  getUserEvents(queryEventTemp = '') {
    let queryEvent;
    if (queryEventTemp.includes('#')) {
      queryEvent = queryEventTemp.split('#')[0];
    } else {
      queryEvent = queryEventTemp;
    }
    const ongoingEvents = this.rcmsEventDataService.getUserEvent('ongoing', 'startDate');
    const pastEvents = this.rcmsEventDataService.getUserEvent('past', 'startDate');
    this.show.pageLoading = true;
    forkJoin({ ongoingEvents, pastEvents }).subscribe(
      (eventResponse: { ongoingEvents: RcmsEventDetail[]; pastEvents: RcmsEventDetail[] }) => {
        this.eventData.ongoing = eventResponse.ongoingEvents;
        this.eventData.past = eventResponse.pastEvents;
        if (queryEvent) {
          const onGoingEvent = this.eventData.ongoing.filter((el) => el.id === queryEvent);
          const pastEvent = this.eventData.past.filter((el) => el.id === queryEvent);
          if (onGoingEvent && onGoingEvent.length > 0) {
            this.show.activeEvent = true;
            this.isFromGlamping = true;
            this.selectEvent(onGoingEvent[0], true);
          } else if (pastEvent && pastEvent.length > 0) {
            this.show.activeEvent = false;
            this.isFromGlamping = true;
            this.selectEvent(pastEvent[0], false);
          } else {
            this.isFromGlamping = false;
            this.showNotifications();
            if (this.eventData.ongoing && this.eventData.ongoing.length > 0) {
              this.show.activeEvent = true;
              this.selectEvent(this.eventData.ongoing[0], true);
            } else if (this.eventData.past && this.eventData.past.length > 0) {
              this.show.activeEvent = false;
              this.selectEvent(this.eventData.past[0], false);
            } else if (this.eventData.ongoing.length <= 0 || this.eventData.past.length <= 0) {
              this.show.notRegisterMessage = true;
            }
          }
        } else {
          this.isFromGlamping = false;
          if (this.eventData.ongoing && this.eventData.ongoing.length > 0) {
            this.show.activeEvent = true;
            this.selectEvent(this.eventData.ongoing[0], true);
          } else if (this.eventData.past && this.eventData.past.length > 0) {
            this.show.activeEvent = false;
            this.selectEvent(this.eventData.past[0], false);
          } else if (this.eventData.ongoing.length <= 0 || this.eventData.past.length <= 0) {
            this.show.notRegisterMessage = true;
          }
        }

        this.teamCenterListEvents();
        this.show.pageLoading = false;
      },
      (err) => {
        console.error('TeamCenterComponent -> getUserEvents -> err', err);
      },
    );
  }

  showNotifications() {
    this.toastService.show('You Are Not Registered For The Selected Event!', { classname: 'bg-dark text-light', delay: 3000 });
  }

  showNoSTeamsNotification() {
    this.toastService.show('Glamping Is Not Available For Selected Team Type!', { classname: 'bg-dark text-light', delay: 3000 });
  }

  reloadEvent() {
    this.selectEvent(this.selected.event, this.show.activeEvent, true);
  }

  selectEvent(event, isActive, isReloading = false, index?: number) {
    this.show.dataLoading = true;
    if (index) {
      this.fixEventOutsideElementIssue(isActive, index);
    }
    if (typeof isReloading === 'undefined' || isReloading === false) {
      this.show.glampingAd =
        isActive &&
        parseInt(event.raceYear, 10) >= 2019 &&
        (parseInt(event.raceYear, 10) > 2019
          ? event.type === 'TRAIL'
          : event.cms_race_slug === 'carolinas_sc' ||
            event.cms_race_slug === 'michigantrail' ||
            event.cms_race_slug === 'tetons' ||
            event.cms_race_slug === 'socal' ||
            event.cms_race_slug === 'floridatrail');
      this.show.showMultiEventPopup = false;

      this.selected.ongoingTabIndex = findIndex(this.eventData.ongoing, { id: event.id });
      this.selected.pastTabIndex = findIndex(this.eventData.past, { id: event.id });

      this.selected.ongoingTabIndex = this.selected.ongoingTabIndex > -1 ? this.selected.ongoingTabIndex : 0;
      this.selected.pastTabIndex = this.selected.pastTabIndex > -1 ? this.selected.pastTabIndex : 0;

      if (this.selected.event && this.selected.event.id === event.id) {
        this.show.dataLoading = false;
        return false;
      }
      this.myRunnerData = null;
      this.show.isCaptain = false;
      this.resetConfig();
    }

    this.selected.event = event;
    if (typeof isActive !== 'undefined') {
      this.show.activeEvent = isActive;
    }
    if (!this.show.activeEvent && (this.show.activeTab === 'Race_Updates' || this.show.activeTab === 'Covid_Check_In')) {
      this.switchTab('Team_Details');
      if (isPlatformBrowser(this.platformId)) {
        window.location.hash = 'Team_Details';
      }
    }
    const now = this.xMomentService.defaultTimeWithTimezone(event.timezone);

    // const checkinActivationDate = this.xMomentService.convertDateIntoDefaultTime(event.startDate).subtract(2, 'days').endOf('day');
    // event.timeToCheckin = now.isBetween(event.teamFreezeDate, checkinActivationDate);

    const checkinActivationDate = this.xMomentService.checInActivationDateFormat(event.startDate);
    event.timeToCheckin = now.isBetween(event.teamFreezeDate, checkinActivationDate);

    event.freezeTeam = now.isAfter(event.teamFreezeDate);
    event.disableDelete = event.freezeTeam;
    event.disableVolunteer = now.isBefore(event.volunteerShiftOpen) || now.isAfter(event.volunteerShiftClose);
    event.disableVolunteerInvite = now.isBefore(event.volunteerShiftOpen);
    event.shiftNotOpened = now.isBefore(event.volunteerShiftOpen);
    event.shiftClosed = now.isAfter(event.volunteerShiftClose);

    event.isVolShiftActive = now.isAfter(event.volunteerShiftOpen) && now.isBefore(event.teamFreezeDate);

    event.inviteFee = 0;
    if (event.lateFee10Amount > 0 && !event.freezeTeam) {
      event.inviteFee = now.isAfter(event.lateFee10) ? event.lateFee10Amount : 0;
    }
    if (event.lateFee20Amount > 0 && !event.freezeTeam) {
      event.inviteFee = now.isAfter(event.lateFee20) ? event.lateFee20Amount : event.inviteFee;
    }
    event.chargeInvite = event.inviteFee > 0;

    const registrationConfigId = event.id;
    const raceSlug = this.selected.event.cms_race_slug;
    let raceType = this.selected.event.type === 'ROAD' ? 'relay' : 'trail';
    raceType = this.selected.event.type === 'SPRINT' ? 'sprint' : this.selected.event.type === 'SUNSET' ? 'sunset' : raceType;
    raceType = this.selected.event.type === 'TRAIL_SPRINT' ? 'trail_sprint' : raceType;

    const promises = {
      getTeamAndRunnerInformation: this.rcmsEventDataService.getTeamAndRunnerInformation(registrationConfigId),
      getEventClassifications: this.rcmsEventDataService.getEventClassifications(registrationConfigId),
      getEventDivsions: this.rcmsEventDataService.getEventDivsions(registrationConfigId),
      getGlammpingCount: this.rcmsEventDataService.getGlammpingCount(registrationConfigId),
    };

    forkJoin(promises).subscribe(
      (response: {
        getTeamAndRunnerInformation: TeamAndRunnerInformation;
        getEventClassifications: ClassificationAndDivision[];
        getEventDivsions: ClassificationAndDivision[];
        getGlammpingCount: Glampings;
      }) => {
        this.glampingCount = response.getGlammpingCount;
        this.information.team = response.getTeamAndRunnerInformation.team;
        if (this.isFromGlamping) {
          if (this.information.team.type !== 'REGULAR' && this.information.team.type !== 'ULTRA') {
            this.showNoSTeamsNotification();
          }
          this.isFromGlamping = false;
        }
        this.information.captain = response.getTeamAndRunnerInformation.captain;
        this.information.runners = response.getTeamAndRunnerInformation.runners;
        this.information.volunteers = response.getTeamAndRunnerInformation.volunteers;
        this.eventData.classifications = response.getEventClassifications;
        this.eventData.divsions = response.getEventDivsions;
        this.divisionBackup = response.getEventDivsions;
        this.classificationBackup = response.getEventClassifications;
        const myEmailId = JSON.parse(localStorage.profilesUser).data.emailAddress;

        this.information.runners.forEach((runner) => {
          runner.phone = runner.phone ? runner.phone.replace(/[^\d]/g, '') : '';
          if (runner.email === myEmailId) {
            this.myRunnerData = runner;
          }
        });

        const volunteerRequired = this.selected.event.volunteerRequired;
        const teamType = this.information.team.type;
        const regPeriod = this.information.team.registrationPeriod;
        this.information.team.volunteerRequired = 0;
        if (volunteerRequired) {
          if (volunteerRequired[teamType]) {
            this.information.team.volunteerRequired = volunteerRequired[teamType][regPeriod] || 0;
          }
        }

        event.disableVolunteerInvite = this.information.team.volunteerRequired > 0 ? event.disableVolunteerInvite : true;

        this.show.isCaptain = this.show.activeEvent ? this.isUserCaptain(this.information.runners) : false;
        let allRunnerCheckin = true;
        this.information.runners.forEach((runner) => {
          if (runner.onlineWebCheckInId == null) {
            allRunnerCheckin = false;
          }
        });
        this.isAllRunnerCheckin = allRunnerCheckin;
        //  Section condition for Covid_Check_In
        if (!this.show.isCaptain) {
          this.runnerSection = true;
          this.captainSection = false;
        } else {
          this.runnerSection = this.information.captain.onlineWebCheckInId ? false : true;
          this.captainSection = this.information.captain.onlineWebCheckInId ? true : false;
        }

        const calls = {
          getInvitedUsers: this.rcmsEventDataService.getInvitedUsers(registrationConfigId, this.information.team.id, 'invited'),
          getUsersProfileImage: null,
        };

        if (this.information.runners.length > 0) {
          event.disableTeamNameEdit = this.show.isCaptain ? now.isAfter(event.teamNameChange) : true;
          event.disableClassificationDivision = this.show.isCaptain ? now.isAfter(event.teamFreezeDate) : true;
          event.isTeamFull = this.information.runners.runnersMax === this.information.runners.length;
          event.disableInvite = !event.freezeTeam ? event.isTeamFull : true;

          let totalPace = 0;
          let totalPaceCount = 0;
          const runnerIds = [];
          this.information.runners.forEach((runner) => {
            if (runner.pace) {
              totalPace += runner.pace;
              totalPaceCount++;
            }
            if (runner.profilesId) {
              runnerIds.push(runner.profilesId);
            }
          });
          this.information.runners.teamPace = totalPace > 0 && totalPaceCount > 0 ? totalPace / totalPaceCount : 0;
          calls.getUsersProfileImage = this.profileRcmsDataService.getUsersProfileImage(runnerIds);
        }
        this.show.dataLoading = false;
        forkJoin(calls).subscribe(
          (res: { getInvitedUsers: InvitedUser[]; getUsersProfileImage: UserInfo[] }) => {
            this.information.invite = res.getInvitedUsers;
            if (res.getUsersProfileImage) {
              res.getUsersProfileImage.forEach((data) => {
                this.profileImages[data.id] = data.profilePhoto ? data.profilePhoto : 'assets/images/user-profile-pic.png';
              });
            }
          },
          (error) => {
            this.show.dataLoading = false;
          },
        );
      },
      (err) => {
        this.show.dataLoading = false;
        if (err.error && err.error.errorMessage) {
          const msg = get(err, 'error.errorMessage');
          this.show.showMultiEventPopup = msg === 'User is on multiple team on the same Event';
        }
      },
    );

    if (raceSlug) {
      /* if (this.raceData[raceSlug] && this.legsData[raceSlug]) {
        this.eventData.cmsEvent = this.raceData[raceSlug];
        this.eventData.legs = this.legsData[raceSlug];
        this.showCheckinBtn(this.eventData.cmsEvent.showCheckin);
        this.show.dataLoading = false;
      } else { */

      this.ragnarCmsDataService.getTeamCenterRaceDataWithGql(raceSlug, teamcenterDataField).subscribe(
        (res: TeamCenterInterface) => {
          const cmsData = {
            showCheckin: res.in_migration ? (res.in_migration === true || res.in_migration === '1' ? true : false) : false,
            updates: res.updates,
            files: res.files,
            volunteer_contact_email: res.volunteer_contact_email,
          };
          this.raceData[raceSlug] = cmsData;
          this.eventData.cmsEvent = cmsData;
          this.showCheckinBtn(cmsData.showCheckin);

          const legData = [];
          res.legs.forEach((legs) => {
            legData[legs.leg_number] = {
              leg_number: legs.leg_number,
              distance: legs.distance || '',
              distance_km: legs.distance_km || '',
              difficulty: legs.difficulty,
            };
          });

          this.legsData[raceSlug] = legData;
          this.eventData.legs = legData;
          this.selected.event.check_in_waiver = res.check_in_waiver;
          this.selected.event.venue_check_in_waiver = res.venue_check_in_waiver;
          this.selected.event.race_check_in_confirmation = res.race_check_in_confirmation;
          this.selected.event.files = res.files;

          this.showDigitalCheckIn(isActive, this.selected.event.id);
          // this.show.dataLoading = false;
        },
        (err) => {
          this.show.dataLoading = false;
          console.error(err);
        },
      );
      // }
    } else {
      this.showCheckinBtn(false);
      this.show.dataLoading = false;
    }
  }

  fixEventOutsideElementIssue(isOngoing, index) {
    const element = $(`.city-team-race ${isOngoing ? '.upcoming-events' : '.past-events'} > li:nth-child(${index + 1})`);
    if (element && element[0]) {
      element[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  isUserCaptain(runnerArray) {
    const captainArray = lodashFilter(runnerArray, (o) => {
      return o.profilesId === this.localStorageService.getUser().id;
    });

    return captainArray.length > 0 && captainArray[0].role === 'CAPTAIN' ? true : false;
  }

  showDigitalCheckIn(isActive, eventId) {
    if (isActive && eventId === 'HJJQmroNr') {
      const modalRef = this.modalService.open(DigitalCheckInComponent, {
        scrollable: true,
        centered: true,
        keyboard: false,
        backdrop: 'static',
        windowClass: 'digital-check-in',
      });
      modalRef.result.then(
        (result) => {},
        (reason) => {},
      );
    }
  }

  showCheckinBtn(showCheckin) {
    this.selected.event.showCheckin = showCheckin;
    if (this.show.activeTab === 'Covid_Check_In') {
      this.switchTab('Team_Details');
    }
  }

  teamCenterListEvents(): void {
    setTimeout(() => {
      const navigation = {
        pastEvents: $('.city-team-race .past-events'),
        pastNextButton: $('.city-team-race .nav-past-next'),
        pastPrevButton: $('.city-team-race .nav-past-prev'),

        upcomingEvents: $('.city-team-race .upcoming-events'),
        upcomingNextButton: $('.city-team-race .nav-upcoming-next'),
        upcomingPrevButton: $('.city-team-race .nav-upcoming-prev'),

        body: $('body').width(),
      };

      if (this.isShowUpcomingEventPrevBtn === '') {
        navigation.upcomingPrevButton.hide();
      }
      navigation.pastPrevButton.hide();
      if (navigation.upcomingEvents[0].scrollWidth !== 0 && navigation.body > navigation.upcomingEvents[0].scrollWidth) {
        navigation.upcomingNextButton.hide();
      } else {
        // tslint:disable-next-line: space-before-function-paren
        navigation.upcomingEvents.on('scroll', function () {
          const val = $(this).scrollLeft();
          if ($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
            navigation.upcomingNextButton.hide();
          } else {
            navigation.upcomingNextButton.show();
          }

          if (val === 0) {
            navigation.upcomingPrevButton.hide();
          } else {
            navigation.upcomingPrevButton.show();
          }
        });
        navigation.upcomingNextButton.on('click', () => {
          this.isShowUpcomingEventPrevBtn = 'clicked';
          navigation.upcomingEvents.animate({ scrollLeft: navigation.upcomingEvents.scrollLeft() + 460 }, 200);
        });
        navigation.upcomingPrevButton.on('click', () => {
          navigation.upcomingEvents.animate({ scrollLeft: navigation.upcomingEvents.scrollLeft() - 460 }, 200);
        });
      }
      if (this.show.activeEvent === false && navigation.body > navigation.pastEvents[0].scrollWidth) {
        navigation.pastNextButton.hide();
      } else {
        const defaultVal = navigation.pastEvents.scrollLeft();
        if (defaultVal === 0) {
          navigation.pastPrevButton.hide();
        } else {
          navigation.pastPrevButton.show();
        }
        // tslint:disable-next-line: space-before-function-paren
        navigation.pastEvents.on('scroll', function () {
          const val = $(this).scrollLeft();

          if ($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
            navigation.pastNextButton.hide();
          } else {
            navigation.pastNextButton.show();
          }

          if (val === 0) {
            navigation.pastPrevButton.hide();
          } else {
            navigation.pastPrevButton.show();
          }
        });
        navigation.pastNextButton.on('click', () => {
          navigation.pastEvents.animate({ scrollLeft: navigation.pastEvents.scrollLeft() + 460 }, 200);
        });
        navigation.pastPrevButton.on('click', () => {
          navigation.pastEvents.animate({ scrollLeft: navigation.pastEvents.scrollLeft() - 460 }, 200);
        });
      }
    }, 0);
  }

  getURLParameter(parameter) {
    let url;
    let search;
    let parsed;
    let count;
    let loop;
    let searchPhrase;
    url = isPlatformBrowser(this.platformId) ? window.location.href : '';
    search = url.indexOf('?');
    if (search < 0) {
      return '';
    }
    searchPhrase = parameter + '=';
    parsed = url.substr(search + 1).split('&');
    count = parsed.length;
    for (loop = 0; loop < count; loop++) {
      if (parsed[loop].substr(0, searchPhrase.length) === searchPhrase) {
        return decodeURI(parsed[loop].substr(searchPhrase.length));
      }
    }
    return '';
  }

  addPageInitEvent(screen_name) {
    const pagePostType = screen_name.replace(/(^|-)./g, (s) => s.slice(-1).toUpperCase());
    this.dataLayerService.pageInitEvent({
      screen_name,
      pagePostType,
      pagePostType2: 'single-page',
    });
  }
}
