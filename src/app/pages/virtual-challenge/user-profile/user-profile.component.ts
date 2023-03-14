import { Component, OnInit, ViewChild } from '@angular/core';
import { VirtualChallengeMemberDataService, VirtualChallengeDataService } from '@core/data/virtual-challenge/virtual-challenge.service';
import { UserInfo } from '@core/interfaces/auth.interface';
import {
  LocalStorageService,
  localStorageConstant,
  virtualChallengeRoutes,
  authRoutes,
  MetaTagsService,
  DefaultPaceService,
  DataLayerService,
} from '@core/utils';
import { Router } from '@angular/router';
import { VirtualChallengeDetail, UserChallengeInfo } from '@core/interfaces/virtual-challenge.interface';
import * as moment from 'moment-timezone';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashSplit from 'lodash/split';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthDataService } from '@core/data/authentication/auth.service';
import { ToastService } from '@components/toast/toast.service';
import * as $ from 'jquery';
import { shirtSizes, profileShirtSizes } from '@core/utils';
import { ImageCropComponent } from '@components/image-crop/image-crop.component';
import { RCMSEventDataService } from '@core/data';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { keys } from 'lodash-es';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('userForm') userForm: FormGroupDirective;
  @ViewChild('profileForm') profileForm: UntypedFormGroup;
  public profileStatsData: UserChallengeInfo;
  public userData = new UserInfo();
  public userFormData = new UserInfo();
  public challengeDetail: VirtualChallengeDetail;

  public show = {
    loading: false,
    loadingButton: false,
    remaining: {
      totalDays: null,
      days: null,
      percentage: null,
    },
    challengeNotFound: false /* challange detail end */,
    editMode: false /* user profile start*/,
    changeImage: false,
    emailSetting: false,
    emailSettingsChanged: false,
    changePassword: false,
    confPasswordError: false,
    incorrectPassword: false,
    dobError: false,
    phoneError: false,
    paceError: false,
    changePasswordError: null,
    newPasswordError: false,
  };
  public allPaceValue = [];

  public password = {
    email: '',
    oldPassword: '',
    newPassword: '',
    confPassword: '',
  };
  public shirtSizes = shirtSizes;
  public profileShirtSizes = profileShirtSizes;

  public changeImage = {
    oldImage: null,
    imageBlob: null,
    profile_file: null,
  };
  public inputFocusCount = 0;

  constructor(
    private router: Router,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    private localStorageService: LocalStorageService,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private metaTagsServices: MetaTagsService,
    private defaultPaceService: DefaultPaceService,
    private modalService: NgbModal,
    private authDataService: AuthDataService,
    private rcmsEventDataService: RCMSEventDataService,
    public toastService: ToastService,
    public dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'user-profile',
      pagePostType: 'userProfile',
      pagePostType2: 'single-page',
    });
    this.userData = this.localStorageService.getUser() || null;

    if (!this.userData) {
      this.show.loading = true;
      this.localStorageService.set(localStorageConstant.redirectTo, `/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`);
      this.router.navigate([`/${authRoutes.main}/${authRoutes.login}`]);
    } else {
      this.setMyAccountData();
      this.getUserExistingChallenge();
      this.setAccordianForProfile();
    }
  }

  setMyAccountData() {
    if (!!this.userData.shirtSize && this.userData.shirtSize !== 'null' && this.userData.shirtSize !== '') {
      const tShirtSize = { 1: 'XS', 2: 'S', 3: 'M', 4: 'L', 5: 'XL', 6: 'XXL' };
      this.userData.shirtSize = tShirtSize[this.userData.shirtSize] ? tShirtSize[this.userData.shirtSize] : this.userData.shirtSize;
    } else {
      this.userData.shirtSize = '';
    }
    if (this.userData.runPace) {
      const pace = lodashSplit(`${this.userData.runPace}`, ':');
      if (pace.length === 2) {
        this.userData.runPace = parseInt(pace[0], 10) * 60 + parseInt(pace[1], 10);
      }
    }

    if (this.userData.dateOfBirth) {
      const date = moment(this.userData.dateOfBirth);
      if (date.isValid()) {
        this.userData.dateOfBirth = date.format('MM/DD/YYYY');
      }
    }
    this.allPaceValue = this.defaultPaceService.getPace();
    this.password.email = this.userData.emailAddress;
    this.userFormData = lodashCloneDeep(this.userData);
    // this.getCountries(); /* NOT IN USE NOW */
  }
  fetchStats() {
    this.show.loading = true;
    this.virtualChallengeMemberDataService.getProfileStats(this.userData.id).subscribe(
      (res) => {
        this.profileStatsData = res;
        this.show.loading = false;
        this.setAccordianForProfile();
      },
      (err) => {
        this.show.loading = false;
        this.setAccordianForProfile();
        console.error(err);
      },
    );
  }

  getUserExistingChallenge() {
    this.show.loading = true;
    this.virtualChallengeDataService.getUserExistingChallenge(this.userData.id).subscribe(
      (response) => {
        this.challengeDetail = response;
        this.metaTagsServices.setTitle(
          `Ragnar Virtual Challenge | Profile | ${this.challengeDetail.name} | ${this.challengeDetail?.contents?.INFO_PAGE?.subTitle}`,
        );
        this.fetchStats();
        const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
        const endDate = moment(this.challengeDetail.endDate);
        const startDate = moment(this.challengeDetail.startDate);
        this.show.remaining.totalDays = endDate.diff(startDate, 'days') + 1;
        this.show.remaining.days = today.diff(startDate, 'days') + 1;

        this.show.remaining.percentage = (this.show.remaining.days * 100) / this.show.remaining.totalDays;
      },
      (err) => {
        this.show.loading = false;
        this.show.challengeNotFound = true;
        this.fetchStats();
        console.error(err);
      },
    );
  }

  validationCheck(type, modelValue, formControl) {
    let value = null;
    const currentYear = new Date().getFullYear();
    if (type === 'birthdate' && modelValue) {
      value = modelValue.split('/');
      if (!(value[0] && !isNaN(Number(value[0])) && Number(value[0]) <= 12)) {
        this.show.dobError = true;
      } else if (!(value[1] && !isNaN(Number(value[1])) && Number(value[1]) <= 31)) {
        this.show.dobError = true;
      } else if (!(value[2] && !isNaN(Number(value[2])) && value[2].length === 4)) {
        this.show.dobError = true;
      } else if (!moment(modelValue, 'MM/DD/YYYY').isValid()) {
        this.show.dobError = true;
      } else if (!(value[2] && !isNaN(Number(value[2])) && Number(value[2]) < currentYear)) {
        this.show.dobError = true;
      } else {
        this.show.dobError = false;
      }

      if (this.show.dobError) {
        formControl.form.controls[type].setErrors({ incorrect: this.show.dobError });
      } else {
        formControl.form.controls[type].setErrors(null);
      }
    }

    if (type === 'phone' && modelValue) {
      this.show.phoneError = !('' + modelValue).replace(/\D/gm, '').match(/^(\d{3})(\d{3})(\d{4})$/) ? true : false;
      if (this.show.phoneError) {
        formControl.form.controls[type].setErrors({ incorrect: this.show.phoneError });
      } else {
        formControl.form.controls[type].setErrors(null);
      }
    }

    if (type === 'runPace' && modelValue) {
      this.show.paceError = modelValue !== '0' ? false : true;
      if (this.show.paceError) {
        formControl.form.controls[type].setErrors({ incorrect: this.show.paceError });
      } else {
        formControl.form.controls[type].setErrors(null);
      }
    }
  }
  fileSelected(evt) {
    // this.show.loadingButton = true;
    const file = evt.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (evt) => {
        this.show.loadingButton = true;
        const modalRef = this.modalService.open(ImageCropComponent, {
          scrollable: true,
          centered: true,
          keyboard: true,
          windowClass: 'image_crop',
        });
        modalRef.componentInstance.componentData = {
          imageData: evt.target.result,
        };

        modalRef.result.then(
          (result) => {
            if (result) {
              const cropImage = result.replace(/^data:image\/\w+;base64,/, '');
              this.changeImage.profile_file = result;
              this.show.changeImage = true;
              this.changeImage.oldImage = this.userData.profilePhoto || '';
              this.changeImage.imageBlob = cropImage;
              this.show.loadingButton = false;
            } else {
              this.show.loadingButton = false;
            }
          },
          (reason) => {
            this.show.loadingButton = false;
          },
        );
      };
      reader.readAsDataURL(file);
      // this.show.loadingButton = false;
    }
  }
  formatPhoneNumber(s) {
    const s2 = ('' + s).replace(/\D/gm, '');
    const m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return !m ? null : '(' + m[1] + ') ' + m[2] + '-' + m[3];
  }
  updatePassword() {
    this.show.incorrectPassword = false;
    this.show.confPasswordError = false;
    this.show.loadingButton = true;
    this.authDataService.changePassword(this.password).subscribe(
      () => {
        this.dataLayerService.formSubmitEvent({
          formName: 'change_password',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
        });

        this.password = {
          email: this.userData.emailAddress,
          oldPassword: '',
          newPassword: '',
          confPassword: '',
        };
        this.show.changePassword = !this.show.changePassword;
        this.show.incorrectPassword = false;
        this.show.confPasswordError = false;
        this.show.loadingButton = false;
        this.toastService.show('Your password has been changed.', { classname: 'bg-success text-light', delay: 3000 });
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'change_password',
          formStatus: this.dataLayerService.formStatus.FAILED,
        });

        let errMsg = null;
        this.show.loadingButton = false;
        this.show.confPasswordError = false;
        if (err.error && err.error.code === 'NotAuthorizedException') {
          this.show.incorrectPassword = true;
        }
        if (err.error && (err.error.code === 'InvalidPasswordException' || err.error.code === 'LimitExceededException')) {
          errMsg = err.error.message;
          this.show.changePasswordError = errMsg;
        }

        if (!this.show.incorrectPassword) {
          this.toastService.show(errMsg !== '' ? errMsg : 'Oh snap! Something went wrong!', {
            classname: 'bg-danger text-light',
            delay: 3000,
          });
        }
      },
    );
  }
  saveAccountSettings(profileForm) {
    if (
      profileForm.invalid ||
      this.userForm.invalid ||
      this.show.loadingButton ||
      this.userData.emailAddress !== this.userFormData.emailAddress
    ) {
      if (this.userData.emailAddress !== this.userFormData.email) {
        this.toastService.show('Cannot update email address!', {
          classname: 'bg-dark text-light',
          delay: 5000,
        });
      }
      return;
    }
    this.show.loadingButton = true;
    const userData: any = lodashCloneDeep(this.userFormData);
    userData.phone = this.formatPhoneNumber(userData.phone);
    if (userData.dateOfBirth) {
      userData.dateOfBirth = moment(userData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
      userData.bornAt = moment(userData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
    }
    this.authDataService.updateUser(userData).subscribe(
      (updatedUserData) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'update_profile',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          ...this.getDataLayerFormObj(profileForm),
        });
        this.show.emailSettingsChanged = false;
        this.localStorageService.saveUser(updatedUserData);
        this.userData = updatedUserData;
        if (this.show.changeImage) {
          this.authDataService
            .uploadProfilePhoto({
              email: updatedUserData.emailAddress,
              img: this.changeImage.imageBlob,
            })
            .subscribe(
              (newImg) => {
                delete this.changeImage.profile_file;
                userData.profilePhoto = newImg.profilePhoto;
                this.userData.profilePhoto = newImg.profilePhoto;
                updatedUserData.profilePhoto = newImg.profilePhoto;
                this.localStorageService.saveUser(updatedUserData);
                this.userData = updatedUserData;
                /* TODO: Delete old photo */
                // this.deletePhoto()
                this.show.editMode = false;
                this.show.loadingButton = false;
              },
              (err) => {
                this.toastService.show('Cannot update userprofile photo, please try again uploading image with smaller size', {
                  classname: 'bg-dark text-light',
                  delay: 5000,
                });
                delete this.changeImage.profile_file;
                this.show.loadingButton = false;
                this.show.editMode = false;
              },
            );
        } else {
          this.show.loadingButton = false;
          this.show.editMode = false;
        }
        this.rcmsEventDataService.updateProfilesRegistration(userData).subscribe(
          (isUpdated) => {},
          (err) => {
            console.error(err);
          },
        );
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'update_profile',
          formStatus: this.dataLayerService.formStatus.FAILED,
          ...this.getDataLayerFormObj(profileForm),
        });
        this.toastService.show(err.error.errorMessage !== '' ? err.error.errorMessage : 'Oh snap! Something went wrong!', {
          classname: 'bg-danger text-light',
          delay: 3000,
        });
        console.error(err);
        // ctrl.blockUI.stop();
        this.show.emailSettingsChanged = false;
        this.show.editMode = false;
        this.show.loadingButton = false;
      },
    );
  }
  checkPassword(password, confPassword, isInvalid) {
    this.show.confPasswordError = false;
    if (!isInvalid) {
      this.show.confPasswordError = password !== confPassword;
      this.show.newPasswordError = password !== confPassword;
    }
  }
  checkNewPassword(password, confPassword) {
    this.show.newPasswordError = false;
    if (confPassword) {
      this.show.confPasswordError = password !== confPassword;
      this.show.newPasswordError = password !== confPassword;
    }
  }
  hideForgetForm() {
    this.password.oldPassword = '';
    this.password.confPassword = '';
    this.password.newPassword = '';
    this.show.confPasswordError = false;
    this.show.changePassword = false;
    this.show.editMode = false;
  }
  hideProfileForm() {
    this.show.loadingButton = false;
    this.show.changeImage = false;
    this.setAllFieldValidate();
    this.changeImage.profile_file = null;
    this.userFormData = lodashCloneDeep(this.userData);
    this.show.editMode = false;
  }
  setAllFieldValidate() {
    if (this.userData.dateOfBirth) {
      const date = moment(this.userData.dateOfBirth);
      if (date.isValid()) {
        this.userData.dateOfBirth = date.format('MM/DD/YYYY');
      }
    }
    this.profileForm.controls.birthdate.setValue(this.userData.dateOfBirth);
    this.profileForm.controls.birthdate.clearValidators();
  }

  setAccordianForProfile() {
    setTimeout(() => {
      if (window.innerWidth <= 768) {
        $('.accrodian-title-profile').click(() => {
          $('#change-text').text('HIDE ALL');
          $('.accrodian-panel-profile').slideToggle();
          $('.accrodian-title-profile').toggleClass('open');
          if ($('h3').hasClass('open') || $('h4').hasClass('open')) {
            $('#change-text').text('HIDE ALL');
            window.scrollTo(0, 0);
          } else {
            $('#change-text').text('SEE ALL');
            window.scrollTo(0, 0);
          }
        });
        $('.accrodian-title-challenge').click(() => {
          $('#change-text').text('HIDE ALL');
          $('.accrodian-panel-challenge').slideToggle();
          $('.accrodian-title-challenge').toggleClass('open');
          if ($('h3').hasClass('open') || $('h4').hasClass('open')) {
            $('#change-text').text('HIDE ALL');
            window.scrollTo(0, 0);
          } else {
            $('#change-text').text('SEE ALL');
            window.scrollTo(0, 0);
          }
        });
        $('.see-all-btn').click(() => {
          if ($('#change-text').text() === 'HIDE ALL') {
            if ($('.accrodian-title-profile').hasClass('open')) {
              $('.accrodian-panel-profile').slideToggle();
              $('.accrodian-title-profile').removeClass('open');
            }
            if ($('.accrodian-title-challenge').hasClass('open')) {
              $('.accrodian-panel-challenge').slideToggle();
              $('.accrodian-title-challenge').removeClass('open');
            }
          } else {
            $('.accrodian-panel-profile').slideToggle();
            $('.accrodian-panel-challenge').slideToggle();
            $('.accrodian-title-profile').toggleClass('open');
            $('.accrodian-title-challenge').toggleClass('open');
          }
          if ($('h3').hasClass('open') || $('h4').hasClass('open')) {
            $('#change-text').text('HIDE ALL');
            window.scrollTo(0, 0);
          } else {
            $('#change-text').text('SEE ALL');
            window.scrollTo(0, 0);
          }
        });
      }
    });
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'update_profile',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'update_profile',
      ...this.getDataLayerFormObj(form),
    });
  }
  getDataLayerFormObj(form) {
    const formFields = {};
    Object.keys(form.controls).forEach((key) => {
      if (!key.includes('password')) {
        formFields[key] = form.controls[key].value || '';
      }
    });
    return formFields;
  }
}
