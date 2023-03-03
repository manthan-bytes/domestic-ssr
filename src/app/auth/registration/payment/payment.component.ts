import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@components/toast/toast.service';
import { UserInfo } from '@core/interfaces/auth.interface';
import { WaiverModalComponent } from '@components/virtual-challenge/waiver-modal/waiver-modal.component';
import { VirtualChallengeDetail, VirtualChallengeOrder, ECommerce } from '@core/interfaces/virtual-challenge.interface';
import {
  SessionStorageService,
  virtualChallengeRoutes,
  sessionStorageConstant,
  registrationRoutes,
  DataLayerService,
  LocalStorageService,
} from '@core/utils';
import { AuthorizeNetService, VirtualChallengeUtilDataService, VirtualChallengeMemberDataService, AuthDataService } from '@core/data';
import * as moment from 'moment-timezone';
import lodashCloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  public show = {
    cardCheck: true,
    loading: false,
    dobError: false,
    phoneError: false,
    pageLoading: false,
  };

  public cardData = {
    cardName: '',
    cardNumber: '',
    month: '',
    year: '',
    cardCode: '',
    zip: '',
    expiration: '',
    waiver: '',
  };

  public userData = new UserInfo();
  public challengeDetail: VirtualChallengeDetail;

  public orderDetail: VirtualChallengeOrder = new VirtualChallengeOrder();

  public svgVisa: string;
  public svgMastercard: string;
  public svgDiscover: string;
  public cardType: string = null;

  public selectedPlan: ECommerce;

  public today: string;

  public optIn = {
    futureEventUpdate: false,
    OBFTextUpdateJune: false,
    AfterShokz: false,
  };
  public inputFocusCount = 0;

  // private params: any;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    public toastService: ToastService,
    private sessionStorageService: SessionStorageService,
    private authorizeNetService: AuthorizeNetService,
    private virtualChallengeUtilDataService: VirtualChallengeUtilDataService,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    private authService: AuthDataService,
    private dataLayerService: DataLayerService,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    /*  this.route.paramMap.subscribe((params: any) => {
      this.params = params.params;
    }); */
    this.today = moment().tz('America/Denver').format('YYYY-MM-DD');
    this.userData = this.sessionStorageService.get(sessionStorageConstant.userInfo);
    this.challengeDetail = this.sessionStorageService.get(sessionStorageConstant.virtualChallengeInfo);
    if (this.userData) {
      this.show.pageLoading = true;
      if (!this.sessionStorageService.get(sessionStorageConstant.virtualChallengeSelectedPlan)) {
        this.router.navigate([
          `/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeDetail.id}/${registrationRoutes.selectPlan}`,
        ]);
      }
      this.selectedPlan = this.sessionStorageService.get(sessionStorageConstant.virtualChallengeSelectedPlan);
      this.priceCalculate(this.selectedPlan);
      this.show.pageLoading = false;
    } else {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`]);
    }

    this.svgVisa = 'assets/images/card-type/visa-filled.svg';
    this.svgMastercard = 'assets/images/card-type/mastercard-filled.svg';
    this.svgDiscover = 'assets/images/card-type/discover-filled.svg';
  }

  priceCalculate(eCommerce) {
    this.orderDetail.shippingCharges = eCommerce.reduce((total, e) => e.shipping + total, 0);
    this.orderDetail.discounts = eCommerce.reduce((total, e) => e.discount + total, 0);
    this.orderDetail.subTotal = eCommerce.reduce((total, e) => e.price + total, 0);
    this.orderDetail.total = this.orderDetail.subTotal + this.orderDetail.shippingCharges - this.orderDetail.discounts;
  }

  crediCardFormatter(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }

  validateCC(cardNumber) {
    if (cardNumber) {
      cardNumber = cardNumber.replace(/\s+/g, '');
      this.cardData.cardNumber = this.crediCardFormatter(cardNumber);
      // visa
      let re = new RegExp('^4');
      if (cardNumber.match(re) !== null) {
        this.svgVisa = 'assets/images/card-type/visa.svg';
        this.cardType = 'visa';
        this.show.cardCheck = true;
        return;
      }
      // Mastercard
      if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(cardNumber)) {
        this.svgMastercard = 'assets/images/card-type/mastercard.svg';
        this.cardType = 'master';
        this.show.cardCheck = true;
        return;
      }
      // Discover
      re = new RegExp('^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)');
      if (cardNumber.match(re) !== null) {
        this.svgDiscover = 'assets/images/card-type/discover.svg';
        this.cardType = 'discover';
        this.show.cardCheck = true;
        return;
      }
      // Amex Card Not supported.
      re = new RegExp('^3[47][0-9]{13}$');
      if (cardNumber.match(re) !== null) {
        this.svgVisa = 'assets/images/card-type/visa-filled.svg';
        this.svgMastercard = 'assets/images/card-type/mastercard-filled.svg';
        this.svgDiscover = 'assets/images/card-type/discover-filled.svg';
        this.cardType = null;
        this.show.cardCheck = true;
        return;
      }
    } else {
      this.cardType = null;
    }
    this.svgVisa = 'assets/images/card-type/visa-filled.svg';
    this.svgMastercard = 'assets/images/card-type/mastercard-filled.svg';
    this.svgDiscover = 'assets/images/card-type/discover-filled.svg';
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
      waiverInfo: this.challengeDetail.contents.WAIVER.waiver,
    };
  }

  complete(form) {
    if (form.invalid) {
      return;
    }

    this.dataLayerService.eCommercePaymentInfoEvent({
      item_name: this.challengeDetail.name, // race name
      item_id: `${this.challengeDetail.id}`, //race ID
      price: this.orderDetail.total, //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: this.challengeDetail.challengeType, // we can use this for race type for example
      item_category2: this.challengeDetail.startDate, // we can use this for the race geolocation
      item_category3: this.challengeDetail.endDate, //any other specification
      item_category4: this.challengeDetail.unitType, //any other specification
      item_variant: this.selectedPlan.type, // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
    this.show.loading = true;
    this.authorizeNetService.authorize(this.cardData).then(
      (respose) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'paymentRegisterForm',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
        });
        this.postOrder(respose);
      },
      (error) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'paymentRegisterForm',
          formStatus: this.dataLayerService.formStatus.FAILED,
        });
        this.show.loading = false;
        if (error[0].code === 'E00117') {
          this.toastService.show('Valid ZipCode Required', { classname: 'bg-dark text-light', delay: 3000 });
        } else if (error[0].code !== 'unknown') {
          this.toastService.show(error[0].text, { classname: 'bg-dark text-light', delay: 3000 });
        }
      },
    );
  }

  postOrder(PaymentToken) {
    const orderDetails = {
      challengeId: this.challengeDetail.id,
      email: this.userData.emailAddress,
      profileId: this.userData.id,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      address: this.userData.address,
      address2: this.userData.address2,
      city: this.userData.city,
      state: this.userData.state,
      country: this.userData.country,
      zipCode: this.userData.zipCode,
      tShirtSize: this.userData.shirtSize,
      bornAt: this.userData.dateOfBirth,
      gender: this.userData.gender,
      phone: this.userData.phone,
      cardNumber: this.cardData.cardNumber.slice(-4),
      paymentToken: PaymentToken,
      challengeECommerceId: this.selectedPlan[0].id /* TODO: Get id from first element of eCommerce array */,
    };

    this.virtualChallengeUtilDataService.generateOrder(orderDetails).subscribe(
      (response: any) => {
        this.dataLayerService.eCommercePurchaseEvent(
          {
            item_name: this.challengeDetail.name, // race name
            item_id: `${this.challengeDetail.id}`, //race ID
            price: this.orderDetail.total, //race price
            item_brand: 'ragnar', // we can use runragnar, or any other specification
            item_category: this.challengeDetail.challengeType, // we can use this for race type for example
            item_category2: this.challengeDetail.startDate, // we can use this for the race geolocation
            item_category3: this.challengeDetail.endDate, //any other specification
            item_category4: this.challengeDetail.unitType, //any other specification
            item_variant: this.selectedPlan.type, // we can use this for example the team type
            quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
          },
          {
            currency: 'USD',
            value: response.paidAmount,
            tax: 0,
            shipping: response.shippingAmount,
            affiliation: 'Ragnar',
            transaction_id: response.transcationId || '',
            coupon: '',
          },
        );
        this.createMember();
      },
      (error) => {
        if (error.error.message === 'Order Found for the member') {
          this.show.loading = true;
          this.createMember();
        } else {
          this.show.loading = false;
        }
      },
    );
  }
  ngOnDestroy() {
    this.sessionStorageService.remove(sessionStorageConstant.challengeTeam);
  }
  createMember() {
    if (this.challengeDetail.unitType !== 'ACTIVITY' || this.sessionStorageService.get(sessionStorageConstant.challengeTeam)) {
      // tslint:disable-next-line: no-any
      const memberDetails: any = {
        challengeId: this.challengeDetail.id,
        profileId: this.userData.id,
        email: this.userData.emailAddress,
        first_name: `${this.userData.firstName} ${this.userData.lastName}`,
        role: 'MEMBER',
        content: {},
        isGoalAchieved: false,
        isChallengeCompleted: false,
        waiverSnapshot: this.challengeDetail.contents.INFO_PAGE.waiver,
      };
      if (!this.sessionStorageService.get(sessionStorageConstant.challengeTeam)) {
        memberDetails.challengeTeamId = this.challengeDetail.contents.CORE_SETTING.challengeTeamId;
      } else {
        memberDetails.challengeTeamId = this.sessionStorageService.get(sessionStorageConstant.challengeTeam);
      }
      this.show.loading = true;
      this.virtualChallengeMemberDataService.create(memberDetails).subscribe(
        (response) => {
          this.updatePartialUser();
          const userData = this.sessionStorageService.get(sessionStorageConstant.userInfo);
          this.saveAccountSettings(userData);
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
          if (error.error.message === 'MEMBER_ALREDY_EXIST') {
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
            this.toastService.show('Something went wrong!', { classname: 'bg-dark text-light', delay: 3000 });
          }
        },
      );
    } else {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.chooseTeam}/${this.challengeDetail.id}`]);
    }
  }

  updatePartialUser() {
    const data = {
      id: this.userData.id,
      optIn: {
        futureEventUpdate: this.optIn.futureEventUpdate,
        OBFTextUpdateJune: this.optIn.OBFTextUpdateJune,
        AfterShokz: this.optIn.AfterShokz,
      },
    };
    this.authService.updatePartialUser(data).subscribe();
  }

  saveAccountSettings(userFormData) {
    const userData = lodashCloneDeep(userFormData);
    this.authService.updateUser(userData).subscribe(
      (updatedUserData) => {
        this.localStorageService.saveUser(updatedUserData);
      },
      (err) => {
        console.error(err);
        // ctrl.blockUI.stop();
      },
    );
  }

  validateCardExpiry(value) {
    let flag = false;
    const duplicateValue = value;
    if (value) {
      value = value.replace(/\ /g, '').replace(/\:/g, '').replace(/\D/g, '');
      if (value.length > 2) {
        if (value.length === 3 && duplicateValue.split('/')[0].length === 1) {
          (document.getElementById('expire') as HTMLInputElement).value = value.substring(0, 1) + '/' + value.substring(1, 3);
          flag = true;
        }
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      if (!flag) {
        (document.getElementById('expire') as HTMLInputElement).value = duplicateValue.split('/')[0].length === 0 ? '/' + value : value;
      }
    }
  }
}
