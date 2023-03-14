import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Team, UserRegistrationInfo } from '@core/interfaces/rcms-team-runner-information.interface';
import { RCMSEventDataService } from '@core/data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamVolunteerFeesComponent } from '@pages/team-center/dialog/team-volunteer-fees/team-volunteer-fees.component';
import { headerRoutes } from '@core/utils/routes-path.constant.service';
import { Glampings, RcmsEventDetail } from '@core/interfaces/rcms-event-details.interface';
import { EventData, TeamDetailsConfig } from '@core/interfaces/team-center.interface';
import { MyRunnerData } from '@core/interfaces/my-runner-data.interface';
import { GlummpingFeesComponent } from '@pages/team-center/dialog/glummping-fees/glummping-fees.component';
import { XMomentService, DataLayerService } from '@core/utils';
import * as moment from 'moment-timezone';
// import { GlammpingFeesComponent } from '@pages/team-center/dialog/glummping-fees/glummping-fees.component';
@Component({
  selector: 'app-team-center-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
})
export class TeamDetailsComponent implements OnInit, OnChanges {
  @Input() isCaptain: boolean;
  @Input() selectedEvent: RcmsEventDetail;
  @Input() teamInformation: Team;
  @Input() volunteerInformation: UserRegistrationInfo[];
  @Input() eventData: EventData;
  @Input() teamDetailConfig: TeamDetailsConfig;
  @Input() showGlampingAd: boolean;
  @Input() isActive: boolean;
  @Input() captainInformation: UserRegistrationInfo;
  @Input() myRunnerData: MyRunnerData;
  @Output() switchTab = new EventEmitter();
  @Input() glampingCount: Glampings;

  public baseVolunteerCharge = 120; /* TODO: Need to make Configurable */
  public teamTypes = {
    REGULAR: 'Standard',
    ULTRA: 'Ultra',
    HIGH_SCHOOL: 'High School',
    SIX_PACK: 'Half',
    BLACK_LOOP: 'Black Loop',
  };

  public show = {
    fees: false,
    loading: false,
  };
  totalVolunteerRegistered = 0;
  eventDataClassificationBackup = [];
  eventDataDivisionBackup = [];
  public volunteerFees = 0;
  public onlyForMixSelection = ['High School', 'Military/Public Service', 'Corporate'];
  public headerRoutes = headerRoutes;
  compairRegDate: boolean;
  registrationOpen: moment.Moment;
  glampingRegistrationClose: moment.Moment;
  curruntDate: moment.Moment;
  inputFocusCount = 0;

  constructor(
    private rcmsEventDataService: RCMSEventDataService,
    private modalService: NgbModal,
    private xMomentService: XMomentService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnChanges(): void {
    if (this.teamInformation && this.teamInformation.glampingPurchasedDate) {
      this.teamInformation.glampingPurchasedDate = this.xMomentService
        .convertDateIntoDefaultTime(this.teamInformation.glampingPurchasedDate)
        .format('MMMM DD, YYYY');
    }
    this.eventDataClassificationBackup = this.eventData.classifications;
    this.eventDataDivisionBackup = this.eventData.divsions;
    this.updateDivisionDropDown(this.teamInformation.classification);
    this.updateClassificationDropdown(this.teamInformation.division);
  }

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'team-center-team-detail',
      pagePostType: 'teamCenterTeamDetail',
      pagePostType2: 'single-page',
    });
    this.registrationOpen = moment(this.selectedEvent.registrationOpen);
    this.glampingRegistrationClose = moment(this.selectedEvent.startDate).subtract(5, 'days');
    this.curruntDate = this.xMomentService.defaultTimeWithTimezone('MDT');
    this.totalVolunteerRegistered =
      this.volunteerInformation.length + this.teamInformation.exemptions + this.teamInformation.paidExemptions;
    this.volunteerFees = this.getVolFee();
    this.updateDivisionDropDown(this.teamInformation.classification);
    this.updateClassificationDropdown(this.teamInformation.division);
  }
  getLateFee() {
    return this.teamInformation ? (this.teamInformation.totalLateFeeAmount || 0) - (this.teamInformation.paidLateFeeAmount || 0) : 0;
  }

  checkGlamping() {
    this.registrationOpen = moment(this.selectedEvent.registrationOpen);
    // this.registrationClose = moment(this.selectedEvent.registrationClose);
    this.glampingRegistrationClose = moment(this.selectedEvent.startDate).subtract(5, 'days');
    this.curruntDate = this.xMomentService.defaultTimeWithTimezone('MDT');
    if (this.registrationOpen < this.curruntDate || this.glampingRegistrationClose > this.curruntDate) {
      return true;
    } else {
      return false;
    }
  }

  getVolFee() {
    const teamInformation = this.teamInformation;
    const selectedEvent = this.selectedEvent;

    let volFee = 0;
    if (selectedEvent) {
      this.show.fees = true;
      if (teamInformation) {
        const baseVolunteerCharge = this.baseVolunteerCharge;
        const volunteerRequired = teamInformation.volunteerRequired || 0;
        const volunteerRegistered = teamInformation.paidExemptions + teamInformation.exemptions + (teamInformation.volunteersCount || 0);

        volFee = (volunteerRequired - volunteerRegistered) * baseVolunteerCharge;
      }
    }
    return volFee <= 0 ? 0 : volFee;
  }

  editTeamName(newTeamName, form) {
    this.teamDetailConfig.onSaveLoadingBar = true;
    const team = this.teamInformation;
    team.name = newTeamName;
    this.rcmsEventDataService.editTeam(team).subscribe(
      () => {
        this.dataLayerService.formSubmitEvent({
          formName: 'teamNameForm',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          ...this.getDataLayerFormObj(form),
        });
        this.teamDetailConfig.editOption = false;
        this.teamDetailConfig.onSaveLoadingBar = false;
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'teamNameForm',
          formStatus: this.dataLayerService.formStatus.FAILED,
          ...this.getDataLayerFormObj(form),
        });
        this.teamDetailConfig.onSaveLoadingBar = false;
        console.error(err);
      },
    );
  }

  isAbleToPay() {
    const selectedEvent = this.selectedEvent;

    let ableToPay = false;
    if (selectedEvent) {
      if (!selectedEvent.freezeTeam) {
        const teamInformation = this.teamInformation;
        if (teamInformation) {
          const chkLateFee = (teamInformation.totalLateFeeAmount || 0) - (teamInformation.paidLateFeeAmount || 0) > 0;

          let chkVolFee = selectedEvent.isVolShiftActive ? true : false;

          if (chkVolFee) {
            const baseVolunteerCharge = this.baseVolunteerCharge;
            const volunteerRequired = teamInformation.volunteerRequired || 0;
            const volunteerRegistered =
              teamInformation.paidExemptions + teamInformation.exemptions + (teamInformation.volunteersCount || 0);

            chkVolFee = (volunteerRequired - volunteerRegistered) * baseVolunteerCharge > 0;
          }
          ableToPay = chkLateFee || chkVolFee;
        }
      }
    }
    return ableToPay;
  }

  openPayFeesModel(model) {
    const modalRef = this.modalService.open(TeamVolunteerFeesComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      backdrop: true,
      windowClass: 'team-center-payment',
    });
    modalRef.componentInstance.componentData = {
      type: 'team',
      teamInformation: this.teamInformation,
      selectedEvent: this.selectedEvent,
      baseVolunteerCharge: this.baseVolunteerCharge,
    };
    modalRef.componentInstance.emitSuccess.subscribe(() => {
      this.volunteerFees = this.getVolFee();
    });
    modalRef.componentInstance.component = {
      type: 'payment',
      price: {},
    };
  }

  openGlampingFeesModel() {
    const modalRef = this.modalService.open(GlummpingFeesComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      backdrop: true,
      windowClass: 'team-center-payment',
    });
    modalRef.componentInstance.componentData = {
      type: 'team',
      teamInformation: this.teamInformation,
      selectedEvent: this.selectedEvent,
      baseVolunteerCharge: this.baseVolunteerCharge,
    };
    modalRef.componentInstance.emitSuccess.subscribe(() => {
      this.teamInformation.isGlampingPurchased = true;
      this.teamInformation.glampingPurchasedDate = this.xMomentService.defaultTime().format('MMMM DD, YYYY');
    });
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
      this.eventData.classifications = this.eventDataClassificationBackup;
    }
  }
  updateDivisionDropDown(classificationName) {
    const mixSelection = this.onlyForMixSelection;
    if (classificationName !== 'Mixed') {
      this.eventData.divsions = this.eventData.divsions.filter((item) => {
        return !(mixSelection.indexOf(item.name) > -1);
      });
    } else {
      return (this.eventData.divsions = this.eventDataDivisionBackup);
    }
  }

  toggleEditOption() {
    this.teamDetailConfig.editOption = !this.teamDetailConfig.editOption;
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'teamNameForm',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'teamNameForm',
      ...this.getDataLayerFormObj(form),
    });
  }
  getDataLayerFormObj(form) {
    const formFields = {};
    Object.keys(form.controls).forEach((key) => {
      formFields[key] = form.controls[key].value || '';
    });
    return formFields;
  }
}
