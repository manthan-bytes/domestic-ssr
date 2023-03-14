import { Component, OnInit, Input, ViewEncapsulation, PLATFORM_ID, Inject } from '@angular/core';
import cloneDeep from 'lodash/cloneDeep';
import indexOf from 'lodash/indexOf';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RCMSEventDataService } from '@core/data';
import { CopyToClipboardService, LocalStorageService, DataLayerService } from '@core/utils';
import { UserInfo } from '@core/interfaces/auth.interface';
import { environment } from '../../../../../environments/environment';
import {
  RunnerVolunteerInviteComponentData,
  RunnerVolunteerInviteCaptainData,
  RunnerVolunteerInviteData,
} from '@core/interfaces/dialog.interface';
import { InvitedUser } from '@core/interfaces/rcms-team-runner-information.interface';
import { TranslateService } from '@ngx-translate/core';
import {isPlatformBrowser} from '@angular/common'

@Component({
  selector: 'app-runner-volunteer-invite',
  templateUrl: './runner-volunteer-invite.component.html',
  styleUrls: ['./runner-volunteer-invite.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RunnerVolunteerInviteComponent implements OnInit {
  @Input() componentData: RunnerVolunteerInviteComponentData;

  public userProfileData: UserInfo;
  public captain: RunnerVolunteerInviteCaptainData;

  public show = {
    loading: false,
    isEmailSend: false,
  };

  public data: RunnerVolunteerInviteData;

  public isCaptainVolunteer;
  public volunteerContactEmail;
  public maxVolunteer;

  public ragnarHubBaseUrl = environment.RCMS_EVENT_API.RAGNAR_HUB_USER_BASEURL || '';

  public isCaptainEmail = false;
  public isRunnerVolunteerEmail = false;
  public isInvitedEmail = false;

  public invalidEmailArray = [];
  public runnerVolunteerArray = [];
  public invitedEmailArray = [];

  public shiftClosed;
  public reloadVolunteer = false;

  public invitationResponse = {};

  public emailList: string;
  public emailMessage: string = null;
  public inviteURL: string;

  public inputFocusCount = 0;

  private invitationInformation: InvitedUser[] = null;
  constructor(
    private activeModal: NgbActiveModal,
    private localStorageService: LocalStorageService,
    private copyToClipboardService: CopyToClipboardService,
    private rcmsEventDataService: RCMSEventDataService,
    private translate: TranslateService,
    private dataLayerService: DataLayerService,
    @Inject(PLATFORM_ID) private platformId:Object
  ) {}

  ngOnInit(): void {
    this.userProfileData = this.localStorageService.getUser();
    if (this.componentData.type === 'volunteer') {
      this.setVolunteerInviteData();
    } else if (this.componentData.type === 'runner') {
      this.setRosterInviteData();
    }
    this.translate.setDefaultLang('en');
  }

  setVolunteerInviteData() {
    this.captain = {
      bornAt: this.componentData.captainInformation.bornAt,
      email: this.componentData.captainInformation.email,
      firstName: this.componentData.captainInformation.firstName,
      id: this.componentData.captainInformation.profilesId,
      lastName: this.componentData.captainInformation.lastName,
      phone: this.componentData.captainInformation.phone,
      jwtToken: this.localStorageService.getToken(),
      address: this.userProfileData.address,
      address2: this.userProfileData.address2,
      city: this.userProfileData.city,
      state: this.userProfileData.state,
      country: this.userProfileData.country,
      zipCode: this.userProfileData.zipCode,
      tShirtSize: this.userProfileData.shirtSize,
      gender: this.userProfileData.gender,
    };
    this.isCaptainVolunteer = this.componentData.isCaptainVolunteer;
    this.volunteerContactEmail = this.componentData.volunteerContactEmail;
    this.maxVolunteer =
      (this.componentData.teamInformation.volunteerRequired || 0) -
      (this.componentData.teamInformation.exemptions +
        this.componentData.teamInformation.paidExemptions +
        this.componentData.volunteerCount);
    this.shiftClosed = cloneDeep(this.componentData.selectedEvent.shiftClosed);
    this.data = {
      teamNameChange: this.componentData.teamNameChange,
      registrationConfigId: this.componentData.registrationConfigId,
      volunteerShiftClose: this.componentData.volunteerShiftClose,
      teamId: this.componentData.teamId,
      captainData: encodeURIComponent(btoa(JSON.stringify(this.captain))),
      captainEmail: this.componentData.captainEmail,
      runnerVolunteerEmails: this.componentData.volunteerEmails,
      inviteEmails: this.componentData.inviteEmails,
    };

    this.inviteURL = `${this.ragnarHubBaseUrl}#/team-builder/${this.data.registrationConfigId}/registration/${this.data.teamId}/volunteer/info`;
  }

  setRosterInviteData() {
    this.data = {
      teamNameChange: this.componentData.teamNameChange,
      registrationConfigId: this.componentData.registrationConfigId,
      registrationClose: this.componentData.registrationClose,
      teamFreezeDate: this.componentData.teamFreezeDate,
      teamId: this.componentData.teamId,
      captainEmail: this.componentData.captainEmail,
      runnerVolunteerEmails: this.componentData.runnerEmails,
      inviteEmails: this.componentData.inviteEmails,
    };

    // tslint:disable-next-line: max-line-length
    this.inviteURL = `${this.ragnarHubBaseUrl}#/team-builder/${this.data.registrationConfigId}/registration/${this.data.teamId}/runner/info`;
  }

  setVolunteerReload() {
    this.reloadVolunteer = true;
    const url = `${this.ragnarHubBaseUrl}#/team-builder/${this.data.registrationConfigId}/registration/${this.data.teamId}/volunteer/info?captain=${this.data.captainData}`;
    isPlatformBrowser(this.platformId) && window.open(url, '_blank');
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  sendInviteRequest(emailList, emailMessage, form) {
    const emailArray = emailList.split(',');
    const validEmailArray = [];

    this.isCaptainEmail = false;
    this.isRunnerVolunteerEmail = false;
    this.isInvitedEmail = false;

    this.invalidEmailArray = [];
    this.runnerVolunteerArray = [];
    this.invitedEmailArray = [];

    let isValid = true;

    for (let i = 0; i < emailArray.length; i++) {
      emailArray[i] = emailArray[i].replace(/ /g, '');
      if (emailArray[i]) {
        if (this.validateEmail(emailArray[i])) {
          if (this.data.captainEmail === emailArray[i]) {
            isValid = false;
            this.isCaptainEmail = true;
          } else if (indexOf(this.data.runnerVolunteerEmails, emailArray[i]) > -1) {
            isValid = false;
            this.isRunnerVolunteerEmail = true;
            this.runnerVolunteerArray.push(emailArray[i]);
          } else if (indexOf(this.data.inviteEmails, emailArray[i]) > -1) {
            isValid = false;
            this.isInvitedEmail = true;
            this.invitedEmailArray.push(emailArray[i]);
          } else {
            validEmailArray.push(emailArray[i]);
          }
        } else {
          isValid = false;
          this.invalidEmailArray.push(emailArray[i]);
        }
      }
    }

    isValid = isValid ? (validEmailArray.length > 0 ? true : false) : isValid;
    if (isValid) {
      const data = {
        emails: validEmailArray,
        message: emailMessage ? emailMessage : null,
        invitationType: this.componentData.type === 'volunteer' ? 'volunteer' : 'member',
      };

      this.show.loading = true;
      this.rcmsEventDataService.inviteUserByEmails(this.componentData.registrationConfigId, this.componentData.teamId, data).subscribe(
        (inviteResponse) => {
          this.dataLayerService.formSubmitEvent({
            formName: this.componentData.type === 'volunteer' ? 'volunteerInviteForm' : 'runnerInviteForm',
            formStatus: this.dataLayerService.formStatus.SUCCESS,
            ...this.getDataLayerFormObj(form),
          });

          // tslint:disable-next-line: no-string-literal
          this.invitationResponse = inviteResponse['response'];
          this.rcmsEventDataService
            .getInvitedUsers(this.componentData.registrationConfigId, this.componentData.teamId, 'invited')
            .subscribe(
              (response: InvitedUser[]) => {
                this.invitationInformation = response;
                this.show.loading = false;
                this.show.isEmailSend = true;
                setTimeout(() => {
                  this.close();
                }, 10000);
              },
              (err) => {
                // TODO: Toastr to show the Error
                this.show.loading = false;
                console.error('SHOW THE TOASTR');
              },
            );
        },
        (err) => {
          this.dataLayerService.formSubmitEvent({
            formName: this.componentData.type === 'volunteer' ? 'volunteerInviteForm' : 'runnerInviteForm',
            formStatus: this.dataLayerService.formStatus.FAILED,
            ...this.getDataLayerFormObj(form),
          });
          // TODO: Toastr to show the Error
          console.error('SHOW THE TOASTR');
          this.show.loading = false;
        },
      );
    }
  }

  copyToClipboard() {
    this.copyToClipboardService.copyText(this.inviteURL);
    this.close();
  }
  close() {
    let args = {};
    if (this.invitationInformation) {
      // tslint:disable-next-line: no-string-literal
      args['invitationInformation'] = this.invitationInformation;
    }
    if (this.reloadVolunteer) {
      // tslint:disable-next-line: no-string-literal
      args['reloadVolunteer'] = this.reloadVolunteer;
    }

    args = Object.keys(args).length ? args : false;
    this.activeModal.close(args);
  }

  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: this.componentData.type === 'volunteer' ? 'volunteerInviteForm' : 'runnerInviteForm',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: this.componentData.type === 'volunteer' ? 'volunteerInviteForm' : 'runnerInviteForm',
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
