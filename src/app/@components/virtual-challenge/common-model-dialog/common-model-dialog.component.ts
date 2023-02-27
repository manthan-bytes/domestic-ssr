import { virtualChallengeRoutes } from './../../../@core/utils/routes-path.constant.service';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { VirtualChallengeNotificationService, VirtualChallengeUtilDataService } from 'src/app/@core/data';
import { VirtualChallengeSharedDataService } from 'src/app/@core/utils';
import { ToastService } from '../../toast/toast.service';

@Component({
  selector: 'app-common-model-dialog',
  templateUrl: './common-model-dialog.component.html',
  styleUrls: ['./common-model-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommonModelDialogComponent implements OnInit {
  @Input() componentData;
  public routes = virtualChallengeRoutes;

  public show = {
    modal: {
      challengeProgress: false,
      renameTeam: false,
      waiver: false,
      invite: false,
      notification: false,
      deleteMember: false,
      declineInvitation: false,
      faq: false,
      virtualGreetings: false,
      deleteActivity: false,
    },
    closeBtn: false,
    loading: false,
  };

  private closeBtnInclude = ['invite', 'notification', 'waiver', 'faq', 'virtualGreetings', 'declineInvitation'];

  public addMileProgress = {
    progressDetails: {
      totalMembers: 0,
      myPosition: 0,
      myRun: 0,
      myRank: 0,
      maxRun: 0,
      minRun: 0,
      avgRun: 0,
      myMilePercentage: 0,
      myRankPercentage: 0,
      safeState: 'NOT',
    },
    addedActivity: null,
    teamDetail: null,
    existingMember: null,
    challengeDetail: null,
    message: '',
    inviteDetails: null,
  };
  // public userData: UserInfo = new UserInfo();

  /* public countries: ICountry[];
  public states: ICountryState[]; */

  /* public shirtSizes = {
    XS: 'Unisex X-Small',
    S: 'Unisex Small',
    M: 'Unisex Medium',
    L: 'Unisex Large',
    XL: 'Unisex X-Large',
    XXL: 'Unisex XX-Large',
  }; */

  constructor(
    private router: Router,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private virtualChallengeNotificationService: VirtualChallengeNotificationService,
    private virtualChallengeSharedDataService: VirtualChallengeSharedDataService,
    private virtualChallengeUtilDataService: VirtualChallengeUtilDataService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    Object.keys(this.show.modal).forEach((key) => {
      this.show.modal[key] = key === this.componentData.type;
    });
    this.show.closeBtn = this.closeBtnInclude.indexOf(this.componentData.type) > -1 ?? true;

    // this.userData = this.localStorageService.get(localStorageConstant.profilesUser) || new UserInfo();

    /* if (this.userData) {
      this.userData.dateOfBirth = moment(this.userData.dateOfBirth).utc().format('DD-MM-YYYY');
    } */

    /* if (this.componentData.type === 'waiver') {
      this.getCountries();
    } */

    if (this.componentData.type === 'challengeProgress') {
      this.setChallengeProgressData();
    }
    this.translate.setDefaultLang('en');

    this.addMileProgress = this.componentData;
  }

  // ngAfterViewInit(): void {
  //   setTimeout(() => {
  //     this.addMileProgress = this.componentData;
  //   }, 500);
  // }

  moveToInfo(challengeId, challengeTeamId) {
    this.closeModal();
    this.router.navigate([`/${this.routes.main}/${this.routes.info}`], {
      queryParams: {
        challengeId,
        challengeTeamId,
        isAcceptInvite: true,
      },
    });
  }

  setChallengeProgressData() {
    const likelySafeMi = this.componentData.progressDetails.bucketLimit.SAFE_MAXIMUM;
    const maybeSafeMi = this.componentData.progressDetails.bucketLimit.MAYBE_SAFE_MAXIMUM;
    const notSafeMi = this.componentData.progressDetails.bucketLimit.NOT_SAFE_MAXIMUM;
    const notSafeMinMi = this.componentData.progressDetails.bucketLimit.NOT_SAFE_MINIMUM;
    const mileage = this.componentData.progressDetails.myRun;
    if (mileage > likelySafeMi) {
      this.componentData.progressDetails.myMilePercentage = 100;
    } else if (mileage > maybeSafeMi) {
      this.componentData.progressDetails.myMilePercentage = this.linear(mileage, maybeSafeMi, likelySafeMi, 0.71, 1.0) * 100;
    } else if (mileage > notSafeMi) {
      this.componentData.progressDetails.myMilePercentage = this.linear(mileage, notSafeMi, maybeSafeMi, 0.31, 0.71) * 100;
    } else {
      this.componentData.progressDetails.myMilePercentage = this.linear(mileage, notSafeMinMi, notSafeMi, 0.0, 0.31) * 100;
    }
  }

  linear(totalMiles: number, milesMin: number, milesMax: number, percentMin: number, percentMax: number) {
    const deltaPercent = percentMax - percentMin;
    const deltaMi = milesMax - milesMin;
    return (deltaPercent / deltaMi) * (totalMiles - milesMin) + percentMin;
  }

  /* getCountries() {
    this.countryService.getCountries().subscribe((countries) => {
      const country = countries.find((country) => country.value === this.userData.country);
      this.localStorageService.set(localStorageConstant.userStateService, {country});
      this.countries = countries;
      this.getUserState();
    });
  }

  onCountryChange() {
    const country = this.countries.find((country) => country.value === this.userData.country);
    if (country) {
      this.localStorageService.set(localStorageConstant.userStateService, {country});
      this.countryService.getStates(country).subscribe((states) => {
        this.states = states;
      });
    }
  }

  getUserState() {
    this.countryService.getStates(this.localStorageService.get(localStorageConstant.userStateService).country).subscribe((states) => {
      this.states = states;
    });
  } */

  closeModal(args?) {
    if (
      this.show.modal.notification &&
      this.componentData.notificationsData &&
      this.componentData.notificationsData.challengeMemberId &&
      this.componentData.notificationsData.totalUnRead
    ) {
      this.setAllNotificationRead(this.componentData.notificationsData.challengeMemberId);
    }
    this.activeModal.close(args);
  }

  setNotificationRead(notification) {
    const data = {
      id: notification.id,
      challengeId: notification.challengeId,
      challengeTeamId: notification.challengeTeamId,
      challengeMemberId: notification.challengeMemberId,
      profileId: notification.profileId,
      isRead: true,
    };

    this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
    this.closeModal();
    this.virtualChallengeNotificationService.setNotificationRead(data).subscribe((response) => {
      this.virtualChallengeSharedDataService.setNotifications(false);
    });
  }

  setAllNotificationRead(challengeMemberId) {
    this.virtualChallengeNotificationService.setAllNotificationRead(challengeMemberId).subscribe((response) => {
      this.virtualChallengeSharedDataService.setNotifications(false);
    });
  }

  deleteActivity(activityId) {
    this.show.loading = true;
    this.virtualChallengeUtilDataService.deleteActivity(activityId).subscribe(
      () => {
        this.show.loading = false;
        this.closeModal(true);
        this.toastService.show('Run deleted successfully!', { classname: 'bg-dark text-light', delay: 3000 });
      },
      (err) => {
        this.show.loading = false;
        if (err.error && err.error.message) {
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        } else {
          this.toastService.show('Something went wrong. Try again after few minutes!', { classname: 'bg-dark text-light', delay: 3000 });
        }
      },
    );
  }

  /* showWaiver() {
    const modalRef = this.modalService.open(WaiverModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: '',
      size: 'lg'
    });

    modalRef.componentInstance.componentData = {
      title: 'Virtual Waiver',
      waiverInfo: 'This is waiver info'
    };
  }

  submitWaiver(form) {
    if (form.invalid) {
      return;
    }
  } */
}
