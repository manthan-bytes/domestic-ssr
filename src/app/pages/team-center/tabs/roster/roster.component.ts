import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Team, UserRegistrationInfo, InvitedUser } from '@core/interfaces/rcms-team-runner-information.interface';
import { RCMSEventDataService } from '@core/data';
import { ToastService } from '@components/toast/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import lodashFilter from 'lodash/filter';
import find from 'lodash/find';
import { RunnerVolunteerDeleteComponent } from '@pages/team-center/dialog/runner-volunteer-delete/runner-volunteer-delete.component';
import { RunnerVolunteerInviteComponent } from '@pages/team-center/dialog/runner-volunteer-invite/runner-volunteer-invite.component';
import { RcmsEventDetail } from '@core/interfaces/rcms-event-details.interface';
import { EventData, RosterConfig } from '@core/interfaces/team-center.interface';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-team-center-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss'],
})
export class RosterComponent {
  @Input() isCaptain: boolean;
  @Input() selectedEvent: RcmsEventDetail;
  @Input() teamInformation: Team;
  @Input() runnerInformation: UserRegistrationInfo[];
  @Input() invitationInformation: InvitedUser[];
  @Input() eventData: EventData;
  @Input() rosterConfig: RosterConfig;
  @Output() reloadEvent = new EventEmitter();

  public show = {
    expand_detail: false,
  };

  constructor(
    private toastService: ToastService,
    private rcmsEventDataService: RCMSEventDataService,
    private modalService: NgbModal,
    private dataLayerService: DataLayerService,
  ) {}

  openInviteRunnerModel(selectedEvent, teamId) {
    if (!this.selectedEvent.disableInvite) {
      const captainData = find(this.runnerInformation, { role: 'CAPTAIN' });
      const captainEmail = captainData ? (captainData.email ? captainData.email : '') : '';
      const runnerData = lodashFilter(this.runnerInformation, { role: 'MEMBER' });
      const runnerEmails = [];

      for (const iterator of runnerData) {
        iterator.email = iterator.email.replace(/ /g, '');
        runnerEmails.push(iterator.email);
      }

      const inviteData = lodashFilter(this.invitationInformation, { invitationType: 'member' });
      const inviteEmails = [];

      for (const iterator of inviteData) {
        iterator.email = iterator.email.replace(/ /g, '');
        inviteEmails.push(iterator.email);
      }

      const modalRef = this.modalService.open(RunnerVolunteerInviteComponent, {
        scrollable: true,
        centered: true,
        keyboard: true,
        windowClass: 'runner_volunteer_invite',
      });

      modalRef.componentInstance.componentData = {
        type: 'runner',
        registrationConfigId: selectedEvent.id,
        teamNameChange: selectedEvent.teamNameChange,
        registrationClose: selectedEvent.registrationClose,
        teamFreezeDate: selectedEvent.teamFreezeDate,
        teamId,
        captainEmail,
        runnerEmails,
        inviteEmails,
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

  toggleDelete() {
    this.rosterConfig.deleteRunner = !this.rosterConfig.deleteRunner;
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
      runnerVolunteerInformation: this.runnerInformation,
      isMemberVolunteerDelete: true,
    };

    modalRef.result.then(
      (result) => {
        if (result && result.reloadEvent) {
          this.reloadEvent.next(null);
        }
        if (result && result.runnerVolunteerInformation) {
          this.runnerInformation = result.runnerVolunteerInformation;
        }
      },
      (reason) => {},
    );
  }

  resendInvitation(invitation) {
    if (!this.selectedEvent.disableInvite) {
      this.rosterConfig.onResendLoadingBar[invitation.id] = true;
      this.rcmsEventDataService.resendEmail(invitation.id).subscribe(
        () => {
          this.rosterConfig.onResendLoadingBar[invitation.id] = false;
          this.toastService.show('Invitation Sent', { classname: 'bg-success text-light', delay: 3000 });
        },
        (err) => {
          this.rosterConfig.onResendLoadingBar[invitation.id] = false;
        },
      );
    }
  }

  deleteRunnerInvite(invitation) {
    const modalRef = this.modalService.open(RunnerVolunteerDeleteComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
      windowClass: 'member_volunteer_delete',
    });
    modalRef.componentInstance.componentData = {
      type: 'inviteDelete',
      deleteInfo: invitation,
      invitationInformation: this.invitationInformation,
      isMemberVolunteerDelete: false,
    };

    modalRef.result.then(
      (result) => {
        /* if (result && result.reloadEvent) {
        this.reloadEvent.next();
      } */
        if (result && result.invitationInformation) {
          /* TODO: Update invitation array after delete */
          this.reloadEvent.next(null);
          this.invitationInformation = result.invitationInformation;
        }
      },
      (reason) => {},
    );
  }
}
