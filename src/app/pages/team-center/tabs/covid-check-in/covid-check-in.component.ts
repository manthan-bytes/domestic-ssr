import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Team, UserRegistrationInfo } from '@core/interfaces/rcms-team-runner-information.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassificationAndDivision, RcmsEventDetail } from '@core/interfaces/rcms-event-details.interface';
import { RCMSEventDataService } from '@core/data';
import { EventData } from '@core/interfaces/team-center.interface';
import { ToastService } from '@components/toast/toast.service';
import { WaiverModalComponent } from '@components/virtual-challenge/waiver-modal/waiver-modal.component';
import { RunnerVolunteerDeleteComponent } from '@pages/team-center/dialog/runner-volunteer-delete/runner-volunteer-delete.component';
import { DataLayerService, MobileDetectionService } from '@core/utils';
import { environment } from 'src/environments/environment';
import { RosterSubstritutionComponent } from '@pages/team-center/dialog/roster-substritution/roster-substritution.component';
import { DomSanitizer } from '@angular/platform-browser';
import range from 'lodash/range';

@Component({
  selector: 'app-team-center-covid-check-in',
  templateUrl: './covid-check-in.component.html',
  styleUrls: ['./covid-check-in.component.scss'],
})
export class CovidCheckInComponent implements OnInit {
  @Input() isCaptain: boolean;
  @Input() selectedEvent: RcmsEventDetail;
  @Input() teamInformation: Team;
  @Input() runnerInformation: UserRegistrationInfo[];
  @Input() captainInformation: UserRegistrationInfo;
  @Input() volunteerInformation: UserRegistrationInfo[];
  @Input() eventData: EventData;
  @Input() runnerSection: boolean;
  @Input() captainSection: boolean;
  @Input() divisionBackup: ClassificationAndDivision[];
  @Input() classificationBackup: ClassificationAndDivision[];
  @Input() activeRunnerTab: number;
  @Input() activeCaptainTab: number;
  @Input() isAllRunnerCheckin: boolean;
  @Output() switchTab = new EventEmitter();

  public _ = { range };

  public show = {
    loading: false,
    expand_detail: 'false',
  };
  public runnerConditions = {
    safetyVideoCheck: false,
    safetyVideoCheck1: false,
    safetyVideoCheck2: false,
    safetyVideoCheck3: false,
    safetyVideoCheck4: false,
    covid19VideoCheck1: false,
    covid19VideoCheck2: false,
    raceWaiverCheck: false,
    additionalWaiverCheck: false,
    safetyFormSubmitted: false,
    safetyFormSubmitted1: false,
    safetyFormSubmitted2: false,
    safetyFormSubmitted3: false,
    safetyFormSubmitted4: false,
    covid19FormSubmitted: false,
    waiverFormSubmitted: false,
  };
  venueWaiverRechecked = false;
  raceWaiverRechecked = false;
  covid19VideoReCheck1 = false;
  covid19VideoReCheck2 = false;
  // divisionClassification = false;
  showRemoveIcon = false;
  eventDataClassificationBackup = [];
  eventDataDivisionBackup = [];
  public isIOS = this.MobileDetectionService.isiOS();
  public isAndroid = this.MobileDetectionService.isAndroid();
  public isAny = this.MobileDetectionService.isAnyMobile();
  teamTypes = {
    REGULAR: 'Standard',
    ULTRA: 'Ultra',
    HIGH_SCHOOL: 'High School',
    SIX_PACK: 'Half',
    BLACK_LOOP: 'Black Loop',
  };
  public onlyForMixSelection = ['High School', 'Military/Public Service', 'Corporate'];

  phoneReminderMessage = `Hey, don\'t forget to check in for our Ragnar \n ` + environment.DOMESTIC_URL;
  mailReminderMessage = `Hey%2c%20don\'t%20forget%20to%20check%20in%20for%20our%20Ragnar%20` + environment.DOMESTIC_URL;
  mailReminderSubject = `Reminder%20Check%20in%20for%20Ragnar`;
  substituteRequested = false;
  checkedInConfirmationNumber: string | number;
  isAnyVolShift = false;
  isVan2Error = false;
  isVanCompareError = false;
  constructor(
    private rcmsEventDataService: RCMSEventDataService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private dataLayerService: DataLayerService,
    private sanitizer: DomSanitizer,
    private MobileDetectionService: MobileDetectionService
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'team-center-covid-check-in',
      pagePostType: 'teamCenterCovidCheckIn',
      pagePostType2: 'single-page',
    });
    this.selectedEvent.files.race_checkin_safety_video = this.selectedEvent.files.race_checkin_safety_video;
    this.eventDataClassificationBackup = this.classificationBackup;
    this.eventDataDivisionBackup = this.divisionBackup;
    this.updateDivisionDropDown(this.teamInformation.classification);
    this.updateClassificationDropdown(this.teamInformation.division);
  }
  setActiveTab(activeTabId: number) {
    this.activeRunnerTab = activeTabId;
    if (activeTabId === 2) {
      const element = document.getElementById('event-logo');
      element.scrollIntoView({ block: 'center' });
    }
  }
  isRoadOrSprintEvent() {
    return this.selectedEvent.type === 'ROAD' || this.selectedEvent.type === 'SPRINT' ? true : false;
  }
  checkPhoneValidation(phoneValue) {
    this.isVanCompareError = false;
    return !('' + phoneValue).replace(/\D/gm, '').match(/^(\d{3})(\d{3})(\d{4})$/) ? true : false;
  }
  vanCompare(van1, van2) {
    if (van1 === van2 && ('' + van2).replace(/\D/gm, '').match(/^(\d{3})(\d{3})(\d{4})$/)) {
      this.isVanCompareError = true;
      return true;
    } else {
      this.isVanCompareError = false;
      return false;
    }
  }
  activeTabProgressBar() {
    if (this.activeCaptainTab === 1) {
      return '7%';
    } else if (this.activeCaptainTab === 1.5) {
      return this.isRoadOrSprintEvent() ? '22%' : '15%';
    } else if (this.activeCaptainTab === 2) {
      return this.isRoadOrSprintEvent() ? '38%' : '27%';
    } else if (this.activeCaptainTab === 3) {
      return this.isRoadOrSprintEvent() ? '60%' : '53%';
    } else if (this.activeCaptainTab === 4) {
      return this.isRoadOrSprintEvent() ? '80%' : '75%';
    } else {
      return '100%';
    }
  }

  submitRunner() {
    let meRunner: UserRegistrationInfo;
    const myEmailId = JSON.parse(localStorage.profilesUser).data.emailAddress;
    this.runnerInformation.forEach((runner) => {
      if (runner.email === myEmailId) {
        meRunner = runner;
      }
    });
    const data = {
      runnerId: meRunner.id,
      check_in_waiver: this.selectedEvent.check_in_waiver,
      venue_check_in_waiver: this.selectedEvent.venue_check_in_waiver,
      race_check_in_confirmation: this.selectedEvent.race_check_in_confirmation,
    };
    this.show.loading = true;
    this.rcmsEventDataService.submitRunnerCheckin(data).subscribe(
      (teamData) => {
        this.show.loading = false;
      },
      (err) => {
        this.show.loading = false;
        this.toastService.show('Something went wrong. Try again after few minutes!', { classname: 'bg-dark text-light', delay: 3000 });
      },
    );
  }
  venueCheckInWaiverChecked() {
    if (!this.runnerConditions.additionalWaiverCheck) {
      this.venueWaiverRechecked = true;
    } else {
      this.venueWaiverRechecked = false;
    }
  }
  showWaiver(waiverData) {
    const modalRef = this.modalService.open(WaiverModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      windowClass: '',
      size: 'lg',
    });

    modalRef.componentInstance.componentData = {
      title: 'Waiver',
      waiverInfo: waiverData,
    };
  }
  raceCheckInWaiverChecked() {
    if (!this.runnerConditions.raceWaiverCheck) {
      this.raceWaiverRechecked = true;
    } else {
      this.raceWaiverRechecked = false;
    }
  }
  populateFormChecks() {
    const selectedEvent = this.selectedEvent;
    if (!selectedEvent.venue_check_in_waiver) {
      this.runnerConditions.additionalWaiverCheck = true;
    }
  }
  covid19safetyChecked2() {
    if (!this.runnerConditions.covid19VideoCheck2) {
      this.covid19VideoReCheck2 = true;
    } else {
      this.covid19VideoReCheck2 = false;
    }
  }
  covid19safetyChecked1() {
    if (!this.runnerConditions.covid19VideoCheck1) {
      this.covid19VideoReCheck1 = true;
    } else {
      this.covid19VideoReCheck1 = false;
    }
  }
  redirectToTeamDetails() {
    if (this.runnerSection) {
      this.activeRunnerTab = 1;
      this.runnerConditions.safetyVideoCheck = false;
      this.runnerConditions.safetyVideoCheck1 = false;
      this.runnerConditions.safetyVideoCheck2 = false;
      this.runnerConditions.safetyVideoCheck3 = false;
      this.runnerConditions.safetyVideoCheck4 = false;
      this.runnerConditions.covid19VideoCheck1 = false;
      this.runnerConditions.covid19VideoCheck2 = false;
      this.runnerConditions.raceWaiverCheck = false;
      this.runnerConditions.additionalWaiverCheck = false;
      this.runnerConditions.safetyFormSubmitted = false;
      this.runnerConditions.safetyFormSubmitted1 = false;
      this.runnerConditions.safetyFormSubmitted2 = false;
      this.runnerConditions.safetyFormSubmitted3 = false;
      this.runnerConditions.safetyFormSubmitted4 = false;
      this.runnerConditions.covid19FormSubmitted = false;
      this.runnerConditions.waiverFormSubmitted = false;
    } else if (this.captainSection) {
      this.activeCaptainTab = 1;
    }
    this.switchTab.next('Team_Details');
  }
  openDeleteRunnerModel(runner) {
    const modalRef = this.modalService.open(RunnerVolunteerDeleteComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      windowClass: 'member_volunteer_delete',
    });
    modalRef.componentInstance.componentData = {
      type: 'userDelete',
      deleteInfo: runner,
      isMemberVolunteerDelete: true,
      runnerVolunteerInformation: this.runnerInformation,
    };

    modalRef.result.then(
      (result) => {
        if (result && result.reloadEvent) {
        }
        if (result && result.runnerVolunteerInformation) {
          this.runnerInformation = result.runnerVolunteerInformation;
          let allRunnerCheckin = true;
          this.runnerInformation.forEach((element) => {
            if (element.onlineWebCheckInId == null) {
              allRunnerCheckin = false;
            }
          });
          this.isAllRunnerCheckin = allRunnerCheckin;
        }
      },
      (reason) => {},
    );
  }
  substitutePopup() {
    const modalRef = this.modalService.open(RosterSubstritutionComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      windowClass: 'checking_member_volunteer_delete',
    });
    // ctrl.$scope.$ctrl.substituteRequested = true;
    modalRef.result.then(
      (data) => {
        this.substituteRequested = true;
      },
      (reason) => {
        this.substituteRequested = true;
      },
    );
  }
  setCaptainActiveTab(activeTabId) {
    /*if (activeTabId === 2) {
      if (this.selectedEvent.type === 'ROAD' && this.teamInformation.type !== 'ULTRA') {
        if (this.teamInformation.van1Phone === this.teamInformation.van2Phone) {
          return;
        }
      } else {
        if (this.checkPhoneValidation(this.teamInformation.van1Phone)) {
          return;
        }
      }
    }*/
    this.activeCaptainTab = activeTabId;
    const element = document.getElementById('event-logo');
    element.scrollIntoView({ block: 'center' });

    /*     if (this.teamInformation.division === '' || this.teamInformation.classification === '') {
      this.divisionClassification = false;
    } else {
      this.divisionClassification = true;
    } */
    if (activeTabId === 1.5) {
      this.teamInformation.van1Phone = this.teamInformation.van1Phone || this.captainInformation.phone;
      this.teamInformation.van2Phone = this.teamInformation.van2Phone || '';
    }
    if (activeTabId === 3) {
      for (const volunteer of this.volunteerInformation) {
        this.isAnyVolShift = volunteer.shiftStartDate ? true : false;
        if (this.isAnyVolShift) {
          break;
        }
      }
    }
  }
  removeRunner() {
    const element = document.getElementById('runner-block');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.showRemoveIcon = !this.showRemoveIcon;
  }

  updateClassification(teamData, classificationName) {
    teamData.classification = classificationName;
    this.rcmsEventDataService.editTeam(teamData).subscribe(
      () => {},
      (err) => {
        console.error(err);
      },
    );
    this.updateDivisionDropDown(classificationName);
  }

  updateDivision(teamData, divisionName) {
    teamData.division = divisionName;
    this.rcmsEventDataService.editTeam(teamData).subscribe(
      () => {},
      (err) => {
        console.error(err);
      },
    );
    this.updateClassificationDropdown(divisionName);
  }
  updateClassificationDropdown(divisionName) {
    if (this.onlyForMixSelection.indexOf(divisionName) > -1) {
      this.eventData.classifications = this.eventData.classifications.filter((item) => {
        return item.name === 'Mixed';
      });
    } else {
      return (this.eventData.classifications = this.eventDataClassificationBackup);
    }
  }
  updateDivisionDropDown(classificationName) {
    const mixSelection = this.onlyForMixSelection;
    if (classificationName !== 'Mixed') {
      this.eventData.divsions = this.eventData.divsions.filter((item) => {
        return !(mixSelection.indexOf(item.name) > -1);
      });
    } else {
      this.eventData.divsions = this.eventDataDivisionBackup;
    }
  }
  submitTeam() {
    const data = {
      registrationConfigId: this.teamInformation.registrationConfigId,
      teamId: this.teamInformation.id,
      van1Phone: this.teamInformation.van1Phone,
      van2Phone: this.teamInformation.van2Phone,
    };
    this.show.loading = true;
    this.rcmsEventDataService.submitCheckIn(data).subscribe(
      (teamData) => {
        // tslint:disable-next-line: no-string-literal
        this.checkedInConfirmationNumber = teamData['checkedInConfirmationNumber'];
        this.show.loading = false;
      },
      (err) => {
        this.show.loading = false;
        this.toastService.show('Something went wrong. Try again after few minutes!', { classname: 'bg-dark text-light', delay: 3000 });
      },
    );
  }
  sanitizeUrl(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  // sms:+1{{ member.phone }}&body={{ phoneReminderMessage }}
  // sms:+1{{ member.phone }}?body={{ phoneReminderMessage }}
  generateIosLink(phone) {
    return 'sms:+1' + phone + '&body=' + this.phoneReminderMessage;
  }
  generateAndroidLink(phone) {
    return 'sms:+1' + phone + '?body=' + this.phoneReminderMessage;
  }
  isShowVolunteerInfo() {
    if (this.volunteerInformation.length > 0 || this.teamInformation.paidExemptions > 0 || this.teamInformation.exemptions > 0) {
      return false;
    } else {
      return true;
    }
  }

  checkTheRequiredParameterExist(value) {
    return !value ? true : false;
  }
  validateVan2Number(phone) {
    const isValid = this.checkPhoneValidation(phone);
    this.isVan2Error = isValid;
  }
}
