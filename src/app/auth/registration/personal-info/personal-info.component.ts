import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserInfo } from '@core/interfaces/auth.interface';
import lodashCloneDeep from 'lodash/cloneDeep';
import {
  LocalStorageService,
  SessionStorageService,
  CountryService,
  sessionStorageConstant,
  virtualChallengeRoutes,
  registrationRoutes,
  authRoutes,
  DataLayerService,
} from '@core/utils';
import { ICountry, ICountryState } from '@core/interfaces/common.interface';
import { VirtualChallengeDetail, VirtualChallengeOrder } from '@core/interfaces/virtual-challenge.interface';
import { ToastService } from '@components/toast/toast.service';
import * as moment from 'moment';
// import * as _ from 'lodash';
import { WaiverModalComponent } from '@components/virtual-challenge/waiver-modal/waiver-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AuthDataService,
  VirtualChallengeMemberDataService,
  VirtualChallengeTeamDataService,
  VirtualChallengeUtilDataService,
} from '@core/data';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  public show = {
    screen: {
      selectPlan: false,
      userInfo: false,
      payment: false,
    },
    cardCheck: true,
    loading: false,
    dobError: false,
    phoneError: false,
    pageLoading: false,
    stateNotInList: false,
  };

  public userData = new UserInfo();
  waiver;

  public countries: ICountry[];
  public states: ICountryState[];

  public shirtSizes = {
    XS: 'Unisex X-Small',
    S: 'Unisex Small',
    M: 'Unisex Medium',
    L: 'Unisex Large',
    XL: 'Unisex X-Large',
    XXL: 'Unisex XX-Large',
  };

  public svgVisa: string;
  public svgMastercard: string;
  public svgDiscover: string;
  public cardType: string = null;

  public challengeDetail: VirtualChallengeDetail;

  public orderDetail: VirtualChallengeOrder = new VirtualChallengeOrder();

  private params: { id: string; challengeTeamId: string };
  public selectedPlan;
  public inputFocusCount = 0;
  Object = Object;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private countryService: CountryService,
    public toastService: ToastService,
    private sessionStorageService: SessionStorageService,
    private modalService: NgbModal,
    private virtualChallengeUtilDataService: VirtualChallengeUtilDataService,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    private virtualChallengeTeamDataService: VirtualChallengeTeamDataService,
    private authDataService: AuthDataService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.params = { id: '', challengeTeamId: '' };
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.params.id = params.get('id');
    });

    this.route.queryParams.subscribe((params) => {
      this.params.challengeTeamId = params.challengeTeamId || null;
    });

    this.userData = this.localStorageService.getUser();
    if (this.userData.gender === null) {
      this.userData.gender = '';
    }

    if (this.userData.shirtSize === null) {
      this.userData.shirtSize = '';
    }

    this.selectedPlan = this.sessionStorageService.get(sessionStorageConstant.virtualChallengeSelectedPlan);
    this.challengeDetail = this.sessionStorageService.get(sessionStorageConstant.virtualChallengeInfo);

    if (this.userData) {
      this.show.pageLoading = true;
      /* if (!this.sessionStorageService.get(sessionStorageConstant.virtualChallengeSelectedPlan)) {
         this.router.navigate([
           `/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.params.id}/${registrationRoutes.selectPlan}`,
         ]);
       } */
      this.show.pageLoading = false;
    } else {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`]);
    }

    if (this.userData.dateOfBirth) {
      const date = moment(this.userData.dateOfBirth);
      if (date.isValid()) {
        this.userData.dateOfBirth = date.format('MM/DD/YYYY');
      }
    }
    this.getCountries();
  }

  showScreen(screen) {
    Object.keys(this.show.screen).forEach((key) => {
      this.show.screen[key] = key === screen;
    });
  }

  getCountries() {
    /* VC2-126: Limit the country drop down to US only */
    if (this.userData.country !== 'USA') {
      this.userData.country = '';
      this.userData.state = '';
    }
    const countries = [{ name: 'United States', value: 'USA', regionFile: 'united-states' }];
    const country = countries.find((f) => f.value === this.userData.country);
    this.sessionStorageService.set(sessionStorageConstant.userStateService, { country });
    this.countries = countries;
    this.getUserState();
    /* this.countryService.getCountries().subscribe((countries) => {
      const country = countries.find((country) => country.value === this.userData.country);
      this.sessionStorageService.set(sessionStorageConstant.userStateService, {country});
      this.countries = [{name: "United States", value: "USA", regionFile: "united-states"}];
      this.getUserState();
    }); */
  }

  onCountryChange() {
    const country = this.countries.find((f) => f.value === this.userData.country);
    if (country) {
      this.sessionStorageService.set(sessionStorageConstant.userStateService, { country });
      this.countryService.getStates(country).subscribe((states) => {
        this.states = states;
        const findState = this.states.find((state) => {
          if (state.value === this.userData.state) {
            return true;
          }
        });
        if (!findState) {
          this.show.stateNotInList = true;
        }
      });
    }
  }

  getUserState() {
    if (this.sessionStorageService.get(sessionStorageConstant.userStateService).country) {
      this.countryService.getStates(this.sessionStorageService.get(sessionStorageConstant.userStateService).country).subscribe((states) => {
        this.states = states;
        const findState = this.states.find((state) => {
          if (state.value === this.userData.state) {
            return true;
          }
        });
        if (!findState) {
          this.show.stateNotInList = true;
        }
      });
    }
  }

  next(form) {
    if (form.invalid) {
      return;
    }

    if (!this.challengeDetail.contents.CORE_SETTING.isMemberPaymentCheck) {
      if (this.params.challengeTeamId && this.params.challengeTeamId !== 'false') {
        this.createMember(form, this.params.challengeTeamId);
      } else {
        const clonedUserData = lodashCloneDeep(this.userData);
        clonedUserData.dateOfBirth = moment(clonedUserData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
        this.sessionStorageService.set(sessionStorageConstant.userInfo, clonedUserData);
        this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.chooseTeam}/${this.params.id}`]);
      }
    } else {
      if (this.params.challengeTeamId && this.params.challengeTeamId !== 'false') {
        this.virtualChallengeTeamDataService.getByid(this.params.challengeTeamId).subscribe(
          (response) => {
            this.virtualChallengeUtilDataService.getOrder(this.challengeDetail.id, this.userData.id).subscribe((response: any) => {
              if (response.isChallengeOrderExist === false) {
                const clonedUserData = lodashCloneDeep(this.userData);
                clonedUserData.dateOfBirth = moment(clonedUserData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';

                this.sessionStorageService.set(sessionStorageConstant.userInfo, clonedUserData);
                this.sessionStorageService.set(sessionStorageConstant.challengeTeam, this.params.challengeTeamId);
                this.router.navigate([
                  `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.params.id}/${registrationRoutes.payment}`,
                ]);
              } else {
                if (this.params.challengeTeamId && this.params.challengeTeamId !== 'false') {
                  this.createMember(form, this.params.challengeTeamId);
                } else {
                  const clonedUserData = lodashCloneDeep(this.userData);
                  clonedUserData.dateOfBirth = moment(clonedUserData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
                  this.sessionStorageService.set(sessionStorageConstant.userInfo, clonedUserData);
                  this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.chooseTeam}/${this.params.id}`]);
                }
              }
            });
          },
          (error) => {
            if (error.error.statusCode === 404) {
              this.toastService.show('Challenge Team Not Found!', { classname: 'bg-dark text-light', delay: 3000 });
            } else {
              this.toastService.show(error.error.message || 'Something went wrong!', { classname: 'bg-dark text-light', delay: 3000 });
            }
            // setTimeout(() => {
            //   this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.home}`]);
            // }, 3000);
          },
        );
      } else {
        this.virtualChallengeUtilDataService.getOrder(this.challengeDetail.id, this.userData.id).subscribe((response: any) => {
          if (response.isChallengeOrderExist === false) {
            const clonedUserData = lodashCloneDeep(this.userData);
            clonedUserData.dateOfBirth = moment(clonedUserData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
            this.sessionStorageService.set(sessionStorageConstant.userInfo, clonedUserData);
            this.sessionStorageService.set(sessionStorageConstant.challengeTeam, this.params.challengeTeamId);
            this.router.navigate([
              `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.params.id}/${registrationRoutes.payment}`,
            ]);
          } else {
            if (this.params.challengeTeamId && this.params.challengeTeamId !== 'false') {
              this.createMember(form, this.params.challengeTeamId);
            } else {
              this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.chooseTeam}/${this.params.id}`]);
            }
          }
        });
      }
    }

    this.dataLayerService.eCommerceShippingInfoEvent({
      item_name: this.challengeDetail.name, // race name
      item_id: `${this.challengeDetail.id}`, //race ID
      price: '', //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: this.challengeDetail.challengeType, // we can use this for race type for example
      item_category2: this.challengeDetail.startDate, // we can use this for the race geolocation
      item_category3: this.challengeDetail.endDate, //any other specification
      item_category4: this.challengeDetail.unitType, //any other specification
      item_variant: '', // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }

  validationCheck(type, modelValue) {
    let value = null;
    const currentYear = new Date().getFullYear();
    if (type === 'dob' && modelValue) {
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
    }

    if (type === 'phone' && modelValue) {
      this.show.phoneError = !('' + modelValue).replace(/\D/gm, '').match(/^(\d{3})(\d{3})(\d{4})$/) ? true : false;
    }
  }

  showWaiver() {
    const modalRef = this.modalService.open(WaiverModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'waiver_info',
    });

    modalRef.componentInstance.componentData = {
      title: `Ragnar ${this.challengeDetail.name} Challenge`,
      waiverInfo: this.challengeDetail.contents.INFO_PAGE.waiver,
    };
  }

  createMember(form, teamId) {
    if (form.invalid) {
      return;
    }
    const memberDetails = {
      challengeId: this.challengeDetail.id,
      challengeTeamId: teamId,
      profileId: this.userData.id,
      email: this.userData.emailAddress,
      first_name: `${this.userData.firstName} ${this.userData.lastName}`,
      role: 'MEMBER',
      content: {},
      waiverSnapshot: this.challengeDetail.contents.INFO_PAGE.waiver,
    };
    this.show.loading = true;
    this.virtualChallengeMemberDataService.create(memberDetails).subscribe(
      (response) => {
        this.saveAccountSettings(this.userData, form);
        this.toastService.show('Registration successful! Redirecting to dashboard...', { classname: 'bg-dark text-light', delay: 3000 });
        setTimeout(() => {
          this.sessionStorageService.flushAll();
          if (this.challengeDetail.challengeType === 'COMMUNITY') {
            this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.DcDashboard}`]);
          } else {
            this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
          }
        }, 2000);
      },
      (error) => {
        if (error.error.message === 'MEMBER_ALREDY_EXIST' || (error.error.code === 'OTHER_ACTIVE_CHALLENGE' && error.status === 422)) {
          this.toastService.show('Member already exist. Redirecting to dashboard...', { classname: 'bg-dark text-light', delay: 3000 });
          setTimeout(() => {
            this.sessionStorageService.flushAll();
            if (this.challengeDetail.challengeType === 'COMMUNITY') {
              this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.DcDashboard}`]);
            } else {
              this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
            }
          }, 3000);
        } else {
          this.show.loading = false;
          if (error.error.code === 'TEAM_NOT_FOUND' || error.error.code === 'GOAL_ACHIEVED') {
            this.toastService.show(error.error.message, { classname: 'bg-dark text-light', delay: 3000 });
          } else {
            this.toastService.show(error.error.message || 'Something went wrong!', { classname: 'bg-dark text-light', delay: 3000 });
          }
        }
      },
    );
  }
  redirectToChooseTeam(form) {
    if (form.invalid) {
      return;
    }
    this.saveAccountSettings(this.userData, form);

    if (this.params.challengeTeamId && this.params.challengeTeamId !== 'false') {
      this.createMember(form, this.params.challengeTeamId);
    } else {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.chooseTeam}/${this.params.id}`]);
    }

    this.dataLayerService.eCommerceShippingInfoEvent({
      item_name: this.challengeDetail.name, // race name
      item_id: `${this.challengeDetail.id}`, //race ID
      price: '', //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: this.challengeDetail.challengeType, // we can use this for race type for example
      item_category2: this.challengeDetail.startDate, // we can use this for the race geolocation
      item_category3: this.challengeDetail.endDate, //any other specification
      item_category4: this.challengeDetail.unitType, //any other specification
      item_variant: '', // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }
  saveAccountSettings(userFormData, form) {
    const userData = lodashCloneDeep(userFormData);
    userData.phone = this.formatPhoneNumber(userData.phone);
    if (userData.dateOfBirth) {
      userData.dateOfBirth = moment(userData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
      userData.bornAt = moment(userData.dateOfBirth).format('YYYY-MM-DD') + ' ' + '23:59:59';
    }
    this.authDataService.updateUser(userData).subscribe(
      (updatedUserData) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'paymentRegisterForm',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          ...this.getDataLayerFormObj(form),
        });
        this.localStorageService.saveUser(updatedUserData);
      },
      (err) => {
        console.error(err);
        // ctrl.blockUI.stop();
      },
    );
  }
  formatPhoneNumber(s) {
    const s2 = ('' + s).replace(/\D/gm, '');
    const m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
    return !m ? null : '(' + m[1] + ') ' + m[2] + '-' + m[3];
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'personalInfoForm',
        ...this.getDataLayerFormObj(form),
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'personalInfoForm',
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
  /* updatePartialUser() {
    const data = {
      id: this.userData.id,
      optIn: {
        futureEventUpdate: this.optIn.futureEventUpdate,
        OBFTextUpdate: this.optIn.OBFTextUpdate,
      },
    };
    this.authService.updatePartialUser(data).subscribe();
  } */
}
