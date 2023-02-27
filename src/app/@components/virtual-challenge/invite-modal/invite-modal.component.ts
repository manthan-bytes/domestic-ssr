import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { VirtualChallengeInviteDataService } from 'src/app/@core/data';
import { UserInfo } from 'src/app/@core/interfaces/auth.interface';
import { LocalStorageService, virtualChallengeRoutes } from 'src/app/@core/utils';
import { environment } from 'src/environments/environment';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent implements OnInit {
  @Input() componentData;
  @Output() emitSuccess = new EventEmitter<number>();

  public emailList: string;
  public allInvitesList = [];
  public userData = new UserInfo();
  public baseUrl = location.origin;
  public show = {
    errorMessage: '',
    loading: false,
    challengeOver: false,
  };
  constructor(
    private activeModal: NgbActiveModal,
    private virtualChallengeInviteDataService: VirtualChallengeInviteDataService,
    private translate: TranslateService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
  ) {
    this.userData = this.localStorageService.getUser() || null;
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('en');
    this.getChallengeInvites();
  }
  copyInviteLink() {
    const url = `${location.origin}${environment.BASE_URL}${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}?challengeId=${this.componentData.challengeDetails.id}&challengeTeamId=${this.componentData.challengeDetails.challengeTeamId}&isAcceptInvite=true`;
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
    this.activeModal.close('dismiss');
  }
  closeModal(args) {
    this.emitSuccess.emit();
    this.activeModal.close(args);
  }
  getChallengeInvites() {
    if (this.componentData.challengeDetails.challengeType === 'TEAM' || this.componentData.challengeDetails.challengeType === 'COMMUNITY') {
      this.virtualChallengeInviteDataService.getAllChallengeInvites(this.componentData.challengeDetails.challengeTeamId).subscribe(
        (response) => {
          this.allInvitesList = response;
        },
        (err) => {},
      );
    }
  }
  validateEmail(email) {
    const validation =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validation.test(String(email).toLowerCase());
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
  sendInvite() {
    this.show.errorMessage = null;
    if (!this.emailList) {
      this.show.errorMessage = 'Email required!';
      return;
    }
    if ((this.componentData.teamMemberDetail || []).find((f) => f.email.toLowerCase() === this.emailList.toLowerCase())) {
      this.show.errorMessage = 'User Already Exist!';
      return;
    }
    if ((this.allInvitesList || []).find((f) => f.email.toLowerCase() === this.emailList.toLowerCase())) {
      this.show.errorMessage = 'Invite Already Exist!';
      return;
    }

    if (this.validateEmail(this.emailList)) {
      const inviteDetails = [
        {
          challengeId: this.componentData.challengeDetails.id,
          challengeTeamId: this.componentData.challengeDetails.challengeTeamId,
          email: this.emailList,
          message: `${this.userData.firstName} ${this.userData.lastName}`,
        },
      ];

      this.show.loading = true;
      this.virtualChallengeInviteDataService
        .createBulk(
          this.componentData.challengeDetails.id,
          this.componentData.challengeDetails.challengeTeamId,
          inviteDetails,
          this.componentData.invitedByEmail,
          true,
        )
        .subscribe(
          (response) => {
            this.emailList = null;
            this.toastService.show('Invite Sent', { classname: 'bg-dark text-light', delay: 3000 });
            this.show.loading = false;
            this.getChallengeInvites();
          },
          (err) => {
            this.show.loading = false;
            this.getChallengeInvites();
            if (
              err.error.code &&
              (err.error.code === 'GOAL_ACHIEVED' || err.error.code === 'DECLINED_USER' || err.error.code === 'BLOCK_INVITE_CREATION')
            ) {
              this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
              this.show.challengeOver = true;
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
}
