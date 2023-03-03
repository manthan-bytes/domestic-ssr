import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import findIndex from 'lodash/findIndex';
import { RCMSEventDataService } from '@core/data';
import { RunnerVolunteerDeleteComponentData } from '@core/interfaces/dialog.interface';
import { InvitedUser } from '@core/interfaces/rcms-team-runner-information.interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-runner-volunteer-delete',
  templateUrl: './runner-volunteer-delete.component.html',
  styleUrls: ['./runner-volunteer-delete.component.scss'],
})
export class RunnerVolunteerDeleteComponent implements OnInit {
  @Input() componentData: RunnerVolunteerDeleteComponentData;

  public show = {
    loading: false,
    runnerVolunteerDeleted: false,
    editMode: false,
    isRunnerVolunteer: false,
  };
  private reloadEvent = false;

  private invitationInformation: InvitedUser[] = null;

  constructor(
    private activeModal: NgbActiveModal,
    private rcmsEventDataService: RCMSEventDataService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.componentData.isMemberVolunteerDelete ? (this.show.isRunnerVolunteer = true) : (this.show.isRunnerVolunteer = false);
    this.translate.setDefaultLang('en');
  }

  deleteMemberVolunteer(volunteer) {
    this.show.loading = true;
    this.rcmsEventDataService.deleteJoinedUser(volunteer.registrationConfigId, volunteer.id).subscribe(
      (isChanged) => {
        const idx = findIndex(this.componentData.runnerVolunteerInformation, { id: volunteer.id });
        this.reloadEvent = true;
        this.componentData.runnerVolunteerInformation.splice(idx, 1);
        this.show.loading = false;
        this.show.runnerVolunteerDeleted = !this.show.runnerVolunteerDeleted;
        setTimeout(() => {
          this.close();
        }, 10000);
      },
      (err) => {
        this.show.loading = false;
        console.error(err);
      },
    );
  }

  deleteInvitation(invitation) {
    this.show.loading = true;
    this.rcmsEventDataService.deleteInvitedUser(invitation.registrationConfigId, invitation.id).subscribe(
      (invitationDeleted) => {
        const idx = findIndex(this.componentData.invitationInformation, { id: invitation.id });

        this.componentData.invitationInformation.splice(idx, 1);

        this.invitationInformation = this.componentData.invitationInformation;
        this.reloadEvent = true;
        this.show.loading = false;
        this.show.runnerVolunteerDeleted = !this.show.runnerVolunteerDeleted;
        setTimeout(() => {
          this.close();
        }, 10000);
      },
      (err) => {
        this.show.loading = false;
        console.error(err);
      },
    );
  }

  close() {
    let args = {};
    if (this.componentData.type === 'userDelete' && this.componentData.runnerVolunteerInformation) {
      // tslint:disable-next-line: no-string-literal
      args['runnerVolunteerInformation'] = this.componentData.runnerVolunteerInformation;
    }
    if (this.reloadEvent) {
      // tslint:disable-next-line: no-string-literal
      args['reloadEvent'] = this.reloadEvent;
    }

    if (this.componentData.type === 'inviteDelete' && this.invitationInformation) {
      // tslint:disable-next-line: no-string-literal
      args['invitationInformation'] = this.invitationInformation;
    }

    args = Object.keys(args).length ? args : false;
    this.activeModal.close(args);
  }
}
