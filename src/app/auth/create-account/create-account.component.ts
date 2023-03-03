import { Component, OnInit, ViewChild } from '@angular/core';
import { UserInfo } from '@core/interfaces/auth.interface';
import { AuthDataService } from '@core/data';
import {
  LocalStorageService,
  localStorageConstant,
  authRoutes,
  virtualChallengeRoutes,
  VirtualChallengeSharedDataService,
  registrationRoutes,
  DataLayerService,
} from '@core/utils';
import { Router } from '@angular/router';
import * as moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
})
export class CreateAccountComponent implements OnInit {
  @ViewChild('createAccountForm', {}) creatAccount: NgForm;
  public createAccountData: UserInfo = new UserInfo();
  public authRoutes = authRoutes;
  public show = {
    createAccountLoading: false,
    error: null,
    dobError: null,
    dobFutureYearErr: null,
  };
  private userData;
  private redirectTo: string;
  private inputFocusCount = 0;
  constructor(
    private router: Router,
    private authService: AuthDataService,
    private localStorageService: LocalStorageService,
    private sharedDataSerivce: VirtualChallengeSharedDataService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.pageViewDataLayerEvent();
    this.userData = this.localStorageService.getUser() || null;
    this.redirectTo = this.localStorageService.get(localStorageConstant.redirectTo) || null;
    if (this.userData) {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`]);
    }
  }

  createAccount(form) {
    this.show.error = null;
    if (form.invalid) {
      this.show.error = 'Please fill up all the fields';
      return;
    }
    this.createAccountData.email = this.createAccountData.email.toLowerCase();
    const clonedCreateAccountData = cloneDeep(this.createAccountData);
    clonedCreateAccountData.dateOfBirth = moment(clonedCreateAccountData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
    this.show.createAccountLoading = true;
    this.authService.createUser(clonedCreateAccountData).subscribe(
      (data) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'create_account',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          ...this.getDataLayerFormObj(form),
        });
        this.authService.login(clonedCreateAccountData).subscribe(
          (response) => {
            response.fullName = `${response.firstName} ${response.lastName}`;
            this.localStorageService.saveUser(response);
            this.localStorageService.saveJwtToken(response.jwtToken);
            this.sharedDataSerivce.setUserData(true);
            if (this.redirectTo && this.redirectTo.split('/')[this.redirectTo.split('/').length - 1] === 'personal-info') {
              // this.router.navigate(this.redirectTo);
              const challengeId = this.redirectTo.split('/')[this.redirectTo.split('/').length - 2];
              const challengeTeamId = this.localStorageService.get('challengeTeamId');
              if (challengeTeamId) {
                this.router.navigate(
                  [
                    `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${challengeId}/${registrationRoutes.personalInfo}`,
                  ],
                  {
                    queryParams: {
                      challengeTeamId: challengeTeamId || null,
                    },
                  },
                );
              } else {
                this.router.navigate([
                  `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${challengeId}/${registrationRoutes.personalInfo}`,
                ]);
              }
            } else if (this.redirectTo) {
              this.router.navigate([this.redirectTo]);
            } else {
              this.router.navigate([`/`]);
            }
          },
          (err) => {
            let errMsg = '';

            if (err.error.message) {
              errMsg = err.error.message;
            }
            this.show.error = errMsg !== '' ? errMsg : 'Oh snap! Something went wrong!';
            this.show.createAccountLoading = false;
          },
        );
      },
      (err) => {
        let errMsg = '';
        this.dataLayerService.formSubmitEvent({
          formName: 'create_account',
          formStatus: this.dataLayerService.formStatus.FAILED,
          ...this.getDataLayerFormObj(form),
        });

        if (err.error.message) {
          errMsg = err.error.message;
        }
        this.show.error = errMsg !== '' ? errMsg : 'Oh snap! Something went wrong!';
        this.show.createAccountLoading = false;
      },
    );
  }

  validationCheck(type, modelValue) {
    let value = null;
    const currentYear = new Date().getFullYear();
    if (type === 'dob' && modelValue) {
      value = modelValue.split('/');
      if (!(value[0] && !isNaN(Number(value[0])) && Number(value[0]) <= 12)) {
        this.show.dobError = true;
        this.show.dobFutureYearErr = false;
      } else if (!(value[1] && !isNaN(Number(value[1])) && Number(value[1]) <= 31)) {
        this.show.dobError = true;
        this.show.dobFutureYearErr = false;
      } else if (!(value[2] && !isNaN(Number(value[2])) && value[2].length === 4)) {
        this.show.dobError = true;
        this.show.dobFutureYearErr = false;
      } else if (!moment(modelValue, 'MM/DD/YYYY').isValid()) {
        this.show.dobError = true;
        this.show.dobFutureYearErr = false;
      } else if (!(value[2] && !isNaN(Number(value[2])) && Number(value[2]) < currentYear)) {
        this.show.dobFutureYearErr = true;
        this.show.dobError = false;
      } else {
        this.show.dobError = false;
        this.show.dobFutureYearErr = false;
      }
    }
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'create_account',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'create_account',
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
  pageViewDataLayerEvent() {
    this.dataLayerService.pageInitEvent({
      screen_name: 'create_account',
      visitorLoginState: 'logged-out',
      visitorType: 'visitor' + 'logged-out',
      visitorEmail: '',
      pagePostType: 'register',
      pagePostType2: 'single-page',
      user_id: '',
    });
  }
}
