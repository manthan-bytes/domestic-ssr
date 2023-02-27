import { Component, OnInit, Input } from '@angular/core';
import { CommonModelDialogComponent } from '../common-model-dialog/common-model-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { VirtualChallengeInviteDataService } from 'src/app/@core/data';
import { UserInfo } from 'src/app/@core/interfaces/auth.interface';
import { VirtualChallengeDetail, VirtualChallengeMember } from 'src/app/@core/interfaces/virtual-challenge.interface';
import { LocalStorageService, DataLayerService, virtualChallengeRoutes } from 'src/app/@core/utils';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-virtual-challenge-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.scss'],
})
export class TeamInfoComponent implements OnInit {
  @Input() challengeDetails: VirtualChallengeDetail;
  @Input() invitedByEmail: string;
  @Input() teamMemberDetail: VirtualChallengeMember[];

  public inviteEmail;

  public show = {
    errorMessage: '',
    loading: false,
    challengeOver: false,
  };
  public allInvitesList = [];
  public userData = new UserInfo();
  public inputFocusCount = 0;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private virtualChallengeInviteDataService: VirtualChallengeInviteDataService,
    private localStorageService: LocalStorageService,
    private translate: TranslateService,
    private dataLayerService: DataLayerService,
  ) {
    this.userData = this.localStorageService.getUser() || null;
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.getChallengeInvites();
  }

  renameTeam() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'rename_team',
    });

    modalRef.componentInstance.componentData = {
      type: 'renameTeam',
      title: 'Rename Team',
      teamName: 'Testing team',
    };
  }
  getChallengeInvites() {
    if (this.challengeDetails && (this.challengeDetails.challengeType === 'TEAM' || this.challengeDetails.challengeType === 'COMMUNITY')) {
      this.virtualChallengeInviteDataService.getAllChallengeInvites(this.challengeDetails.challengeTeamId).subscribe(
        (response) => {
          this.allInvitesList = response;
        },
        (err) => {},
      );
    }
  }
  resentInvite(inviteId: string, invitedTo: string) {
    this.virtualChallengeInviteDataService
      .resendChallengeInvite(inviteId, invitedTo, this.invitedByEmail, this.challengeDetails.challengeTeamId, this.challengeDetails.id)
      .subscribe(
        (response) => {
          this.toastService.show('Invitation send successfully', { classname: 'bg-dark text-light', delay: 3000 });
        },
        (err) => {
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        },
      );
  }
  sentInvite() {
    this.show.errorMessage = null;
    if (!this.inviteEmail) {
      this.show.errorMessage = 'Email required!';
      return;
    }
    if ((this.teamMemberDetail || []).find((f) => f.email.toLowerCase() === this.inviteEmail.toLowerCase())) {
      this.show.errorMessage = 'User Already Exist!';
      return;
    }

    if ((this.allInvitesList || []).find((f) => f.email.toLowerCase() === this.inviteEmail.toLowerCase())) {
      this.show.errorMessage = 'Invite Already Exist!';
      return;
    }

    if (this.validateEmail(this.inviteEmail)) {
      const inviteDetails = [
        {
          challengeId: this.challengeDetails.id,
          challengeTeamId: this.challengeDetails.challengeTeamId,
          email: this.inviteEmail,
          message: `${this.userData.firstName} ${this.userData.lastName}`,
        },
      ];

      this.show.loading = true;
      this.virtualChallengeInviteDataService
        .createBulk(this.challengeDetails.id, this.challengeDetails.challengeTeamId, inviteDetails, this.invitedByEmail, true)
        .subscribe(
          (response) => {
            this.dataLayerService.formSubmitEvent({
              formName: 'team-info-invite',
              formStatus: this.dataLayerService.formStatus.SUCCESS,
              inviteEmail: this.inviteEmail,
            });

            this.inviteEmail = null;
            this.toastService.show('Invite Sent', { classname: 'bg-dark text-light', delay: 3000 });
            this.inviteEmail = null;
            this.show.loading = false;
            this.getChallengeInvites();
          },
          (err) => {
            this.dataLayerService.formSubmitEvent({
              formName: 'team-info-invite',
              formStatus: this.dataLayerService.formStatus.FAILED,
              inviteEmail: this.inviteEmail,
            });
            this.show.loading = false;
            this.getChallengeInvites();
            if (err.error.code && err.error.code === 'GOAL_ACHIEVED') {
              this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
              this.show.challengeOver = true;
            } else if (err.error.message) {
              this.toastService.show(err.error.message, {
                classname: 'bg-dark text-light',
                delay: 3000,
              });
            } else {
              this.toastService.show('Something went wrong. Try again after few minutes!', {
                classname: 'bg-danger text-light',
                delay: 3000,
              });
            }
          },
        );
    } else {
      this.show.errorMessage = 'Single Valid Email Required!';
    }
  }
  checkEmailValidation(email) {
    if (!email) {
      this.show.errorMessage = 'Email required!';
    } else if (!this.validateEmail(email)) {
      this.show.errorMessage = 'Single Valid Email Required!';
    } else {
      this.show.errorMessage = '';
    }
  }

  validateEmail(email) {
    const validation =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validation.test(String(email).toLowerCase());
  }

  copyInviteLink() {
    let url = '';

    if (this.challengeDetails.challengeType !== 'TEAM' && this.challengeDetails.challengeType !== 'COMMUNITY') {
      url = `${location.origin}${environment.BASE_URL}${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}?challengeId=${this.challengeDetails.id}&challengeTeamId=${this.challengeDetails.challengeTeamId}`;
    } else {
      url = `${location.origin}${environment.BASE_URL}${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}?challengeId=${this.challengeDetails.id}&challengeTeamId=${this.challengeDetails.challengeTeamId}&isAcceptInvite=true`;
    }
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

    this.toastService.show('Invite code copied to clipboard', { classname: 'bg-success text-light', delay: 3000 });
  }
  formElementEnter(inviteEmail) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'team-info-invite',
        inviteEmail,
      });
    }
  }
  formElementExit(inviteEmail) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'team-info-invite',
      inviteEmail,
    });
  }
}
