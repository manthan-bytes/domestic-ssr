import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import range from 'lodash/range';
import lodashFilter from 'lodash/filter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRegistrationInfo, Team, InvitedUser, TeamAndRunnerInformation } from '@core/interfaces/rcms-team-runner-information.interface';
import { VolunteersConfig, CmsEvent } from '@core/interfaces/team-center.interface';
import { RcmsEventDetail } from '@core/interfaces/rcms-event-details.interface';
import { ToastService } from '@components/toast/toast.service';
import { RCMSEventDataService } from '@core/data/rcms-services/rcms-event.service';
import { RunnerVolunteerInviteComponent } from '@pages/team-center/dialog/runner-volunteer-invite/runner-volunteer-invite.component';
import { RunnerVolunteerDeleteComponent } from '@pages/team-center/dialog/runner-volunteer-delete/runner-volunteer-delete.component';
import { TeamVolunteerFeesComponent } from '@pages/team-center/dialog/team-volunteer-fees/team-volunteer-fees.component';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-team-center-volunteers',
  templateUrl: './volunteers.component.html',
  styleUrls: ['./volunteers.component.scss'],
})
export class VolunteersComponent {
  @Input() isCaptain: boolean;
  @Input() selectedEvent: RcmsEventDetail;
  @Input() teamInformation: Team;
  @Input() volunteerInformation: UserRegistrationInfo[];
  @Input() invitationInformation: InvitedUser[];
  @Input() captainInformation: UserRegistrationInfo;
  @Input() cmsEvent: CmsEvent;
  @Input() volunteerConfig: VolunteersConfig;
  @Output() reloadEvent = new EventEmitter();

  public _ = { range, lodashFilter };

  public show = {
    expand_detail: false,
  };
  constructor(
    private toastService: ToastService,
    private rcmsEventDataService: RCMSEventDataService,
    private modalService: NgbModal,
    private dataLayerService: DataLayerService,
  ) {}

  getVolunteers() {
    this.rcmsEventDataService
      .getTeamAndRunnerInformation(this.selectedEvent.id, 'VOLUNTEER')
      .subscribe((response: TeamAndRunnerInformation) => {
        this.volunteerInformation = response.volunteers;
      });
  }

  toggleDelete() {
    this.volunteerConfig.deleteVolunteer = !this.volunteerConfig.deleteVolunteer;
  }

  checkVolShift() {
    const volunteerInformation = this.volunteerInformation;
    const teamInformation = this.teamInformation;
    const selectedEvent = this.selectedEvent;

    return (
      volunteerInformation.length + teamInformation.exemptions + teamInformation.paidExemptions >= teamInformation.volunteerRequired ||
      !selectedEvent.isVolShiftActive
    );
  }

  resendInvitation(invitation) {
    if (!this.selectedEvent.disableVolunteer) {
      this.volunteerConfig.onResendLoadingBar[invitation.id] = true;
      this.rcmsEventDataService.resendEmail(invitation.id).subscribe(
        (isSend) => {
          this.volunteerConfig.onResendLoadingBar[invitation.id] = false;
          this.toastService.show('Invitation Sent', { classname: 'bg-success text-light', delay: 3000 });
        },
        (err) => {
          this.volunteerConfig.onResendLoadingBar[invitation.id] = false;
        },
      );
    }
  }

  openInviteVolunteerModel(selectedEvent, teamId) {
    if (!this.selectedEvent.disableVolunteerInvite) {
      const captainData = this.captainInformation;
      const captainEmail = captainData ? (captainData.email ? captainData.email : '') : '';
      const volunteerData = this.volunteerInformation;
      const volunteerEmails = [];

      for (const iterator of volunteerData) {
        iterator.email = iterator.email.replace(/ /g, '');
        volunteerEmails.push(iterator.email);
      }

      const inviteData = this._.lodashFilter(this.invitationInformation, { invitationType: 'volunteer' });
      const inviteEmails = [];

      for (const iterator of inviteData) {
        iterator.email = iterator.email.replace(/ /g, '');
        inviteEmails.push(iterator.email);
      }

      let isCaptainVolunteer = false;
      if (captainData) {
        isCaptainVolunteer = this._.lodashFilter(this.volunteerInformation, { email: captainData.email }).length > 0;
      }

      const modalRef = this.modalService.open(RunnerVolunteerInviteComponent, {
        scrollable: true,
        centered: true,
        keyboard: true,
        windowClass: 'runner_volunteer_invite',
      });

      modalRef.componentInstance.componentData = {
        type: 'volunteer',
        registrationConfigId: selectedEvent.id,
        teamNameChange: selectedEvent.teamNameChange,
        teamId,
        volunteerShiftClose: selectedEvent.volunteerShiftClose,
        captainInformation: this.captainInformation,
        teamInformation: this.teamInformation,
        volunteerCount: this.volunteerInformation.length,
        volunteerContactEmail: this.cmsEvent.volunteer_contact_email,
        isCaptainVolunteer,
        captainEmail,
        volunteerEmails,
        inviteEmails,
        selectedEvent,
      };

      modalRef.result.then(
        (result) => {
          if (result && result.reloadVolunteer) {
            result.reloadVolunteer = false;
            this.reloadEvent.next(null);
          }
          if (result && result.invitationInformation) {
            this.invitationInformation = result.invitationInformation;
          }
        },
        (reason) => {},
      );
    }
  }

  openDeleteVolunteerModel(volunteer) {
    const modalRef = this.modalService.open(RunnerVolunteerDeleteComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      windowClass: 'member_volunteer_delete',
    });
    modalRef.componentInstance.componentData = {
      type: 'userDelete',
      deleteInfo: volunteer,
      runnerVolunteerInformation: this.volunteerInformation,
      isMemberVolunteerDelete: true,
    };

    modalRef.result.then(
      (result) => {
        if (result && result.reloadEvent) {
          this.reloadEvent.next(null);
        }
        if (result && result.runnerVolunteerInformation) {
          this.volunteerInformation = result.runnerVolunteerInformation;
        }
      },
      (reason) => {},
    );
  }

  deleteRunnerInvite(inviteinfo) {
    const modalRef = this.modalService.open(RunnerVolunteerDeleteComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'member_volunteer_delete',
    });
    modalRef.componentInstance.componentData = {
      type: 'inviteDelete',
      deleteInfo: inviteinfo,
      invitationInformation: this.invitationInformation,
      isMemberVolunteerDelete: false,
    };

    modalRef.result.then(
      (result) => {
        if (result && result.invitationInformation) {
          /* TODO: Update invitation array after delete */
          this.reloadEvent.next(null);
          this.invitationInformation = result.invitationInformation;
        }
      },
      (reason) => {},
    );
  }

  openVolunteerFeesModel() {
    const modalRef = this.modalService.open(TeamVolunteerFeesComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      backdrop: true,
      windowClass: 'team-center-payment',
    });
    modalRef.componentInstance.componentData = {
      type: 'volunteer',
      teamInformation: this.teamInformation,
      selectedEvent: this.selectedEvent,
    };

    modalRef.result.then(
      (result) => {},
      (reason) => {},
    );
  }

  isShowVolunteerInfo() {
    if (this.volunteerInformation.length > 0 || this.teamInformation.paidExemptions > 0 || this.teamInformation.exemptions > 0) {
      return false;
    } else {
      return true;
    }
  }
}
