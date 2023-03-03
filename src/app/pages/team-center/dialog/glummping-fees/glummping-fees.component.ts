import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment-timezone';
import { RCMSEventDataService, AuthorizeNetService } from '@core/data';
import { ToastService } from '@components/toast/toast.service';
import { TeamVolunteerFeesComponentData } from '@core/interfaces/dialog.interface';
import { TranslateService } from '@ngx-translate/core';
import { headerRoutes, DataLayerService } from '@core/utils';
import { GlampingCoupon } from '@core/interfaces/rcms-event-details.interface';

@Component({
  selector: 'app-glummping-fees',
  templateUrl: './glummping-fees.component.html',
  styleUrls: ['./glummping-fees.component.scss'],
})
export class GlummpingFeesComponent implements OnInit {
  @Input() componentData: TeamVolunteerFeesComponentData;
  @Input() component: { type: string; price: object };
  @Output() emitSuccess = new EventEmitter<string>();
  public show = {
    cardCheck: true,
    loading: false,
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

  public userData;
  public filteredDate: { prices: { USD: { GLAMMPING: number } } };
  public svgVisa: string;
  public svgMastercard: string;
  public svgDiscover: string;
  public cardType: string = null;
  public promocode: string;

  public today = moment().tz('America/Denver').format('YYYY-MM-DD');

  public volunteerCount: number;
  public maxVolunteer: number;

  public baseVolunteerCharge: number;

  public calculatedFees = {
    runner: 0,
    volunteer: 0,
    subTotal: 0,
    charge: 0,
    transactionFees: 0,
    grandTotal: 0,
  };

  public paymentCardInfo = false;

  public isPaymentDone = false;

  public hidePayment = false;

  private fees = {
    runner: 0,
    volunteer: 0,
    transactionPerecentage: 0,
  };

  public headerRoutes = headerRoutes;
  glampingCoupon: GlampingCoupon;
  inputFocusCount = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private rcmsEventDataService: RCMSEventDataService,
    private authorizeNetService: AuthorizeNetService,
    public toastService: ToastService,
    private translate: TranslateService,
    public dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.baseVolunteerCharge = this.componentData.baseVolunteerCharge ? this.componentData.baseVolunteerCharge : 120;
    this.svgVisa = 'assets/images/card-type/visa-filled.svg';
    this.svgMastercard = 'assets/images/card-type/mastercard-filled.svg';
    this.svgDiscover = 'assets/images/card-type/discover-filled.svg';
    this.setComponentDetail();
    this.translate.setDefaultLang('en');
  }

  setComponentDetail() {
    const volunteerCount =
      (this.componentData.teamInformation.volunteerRequired || 0) -
      (this.componentData.teamInformation.exemptions +
        this.componentData.teamInformation.paidExemptions +
        this.componentData.teamInformation.volunteersCount);

    this.volunteerCount = volunteerCount <= 0 ? 0 : volunteerCount;

    this.maxVolunteer = this.volunteerCount;

    this.fees = {
      runner:
        this.componentData.type === 'team'
          ? (this.componentData.teamInformation.totalLateFeeAmount || 0) - (this.componentData.teamInformation.paidLateFeeAmount || 0)
          : 0,
      volunteer: this.componentData.selectedEvent.isVolShiftActive ? this.volunteerCount * this.baseVolunteerCharge : 0,
      // tslint:disable-next-line: max-line-length
      transactionPerecentage:
        this.componentData.selectedEvent.taxes[Object.keys(this.componentData.selectedEvent.taxes)[0]].transactionFee || 0,
    };

    this.calculatedFees = {
      runner: this.fees.runner,
      volunteer: this.componentData.selectedEvent.isVolShiftActive ? this.volunteerCount * this.baseVolunteerCharge : 0,
      subTotal: this.fees.runner + this.fees.volunteer,
      charge: this.baseVolunteerCharge,
      transactionFees: (this.fees.runner * (this.fees.transactionPerecentage || 0)) / 100,
      grandTotal: 0,
    };

    this.calculatedFees.grandTotal = this.calculatedFees.subTotal + this.calculatedFees.transactionFees;

    this.paymentCardInfo = this.calculatedFees.grandTotal === 0 ? false : true;
  }

  addVolunteer() {
    if (!this.volunteerCount) {
      this.volunteerCount = 0;
    } else if (this.volunteerCount > this.maxVolunteer) {
      this.volunteerCount = this.maxVolunteer;
    }

    this.calculatedFees.volunteer = this.volunteerCount * this.calculatedFees.charge;
    this.calculatedFees.subTotal = this.calculatedFees.runner + this.calculatedFees.volunteer;
    this.calculatedFees.grandTotal = this.calculatedFees.subTotal + this.calculatedFees.transactionFees;
    if (this.calculatedFees.grandTotal === 0) {
      this.paymentCardInfo = false;
    } else {
      this.paymentCardInfo = true;
    }
  }

  complete(form) {
    if (!this.show.cardCheck) {
      this.toastService.show('Hold on! There are errors that need to be fixed.', { classname: 'bg-dark text-light', delay: 3000 });
      return;
    }
    if (form.invalid) {
      return;
    }
    this.show.loading = true;
    this.authorizeNetService.authorize(this.cardData).then(
      (respose) => {
        this.payCharges(respose, form);
      },
      (error) => {
        this.show.loading = false;
        if (error[0].code === 'E00117') {
          this.toastService.show('Valid ZipCode Required', { classname: 'bg-dark text-light', delay: 3000 });
        } else if (error[0].code !== 'unknown') {
          this.toastService.show(error[0].text, { classname: 'bg-dark text-light', delay: 3000 });
        }
      },
    );
  }

  completeOrder() {
    const orderObjectData = {
      teamId: this.componentData.teamInformation.id,
      token: '',
      cardNumber: '',
      couponCode: '',
    };
    orderObjectData.couponCode = this.promocode;
    this.rcmsEventDataService.createGlampingOrder(this.componentData.teamInformation.registrationConfigId, orderObjectData).subscribe(
      (respones) => {
        this.isPaymentDone = true;
        setTimeout(() => {
          this.close();
        }, 10000);
        this.show.loading = false;
        this.toastService.show('Payment Received. Thank You!', { classname: 'bg-success text-light', delay: 3000 });
        this.emitSuccess.emit();
      },
      (err) => {
        this.show.loading = false;
        this.isPaymentDone = false;
        this.toastService.show((err || {}).error.errorMessage || 'Something went wrong!', {
          classname: 'bg-danger text-light',
          delay: 3000,
        });
      },
    );
  }

  payCharges(paymentToken, form) {
    // tslint:disable-next-line
    const orderObject: any = {
      teamId: this.componentData.teamInformation.id,
      token: paymentToken,
      cardNumber: this.cardData.cardNumber.slice(-4),
    };
    orderObject.couponCode = this.promocode;
    this.rcmsEventDataService.createGlampingOrder(this.componentData.teamInformation.registrationConfigId, orderObject).subscribe(
      (respones) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'glampingPaymentForm',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
        });
        this.isPaymentDone = true;
        setTimeout(() => {
          this.close();
        }, 10000);
        this.show.loading = false;
        this.toastService.show('Payment Received. Thank You!', { classname: 'bg-success text-light', delay: 3000 });
        this.emitSuccess.emit();
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'glampingPaymentForm',
          formStatus: this.dataLayerService.formStatus.FAILED,
        });
        this.show.loading = false;
        if ((err || {}).error.errorMessage === 'Promocode is not valid') {
          this.hidePayment = false;
          this.glampingCoupon = undefined;
          this.promocode = '';
        }
        this.isPaymentDone = false;
        this.toastService.show((err || {}).error.errorMessage || 'Something went wrong!', {
          classname: 'bg-danger text-light',
          delay: 3000,
        });
      },
    );
  }

  clearError(cardNumber) {
    let re = new RegExp('^4');
    re = new RegExp('^3[47][0-9]{13}$');
    if (cardNumber.match(re) !== null) {
      this.show.cardCheck = false;
    } else {
      this.show.cardCheck = true;
    }
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
    this.show.cardCheck = true;

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
        this.show.cardCheck = false;

        return;
      }
    } else {
      this.cardType = null;
    }
    this.svgVisa = 'assets/images/card-type/visa-filled.svg';
    this.svgMastercard = 'assets/images/card-type/mastercard-filled.svg';
    this.svgDiscover = 'assets/images/card-type/discover-filled.svg';
  }

  close() {
    this.activeModal.close();
  }
  applyPromocode() {
    if (this.promocode) {
      const requestObject = {
        couponCode: this.promocode,
        eventType: this.componentData.teamInformation.type,
        teamType: this.componentData.teamInformation.type,
      };
      this.rcmsEventDataService
        .applyPromocode(this.componentData.teamInformation.registrationConfigId, requestObject, { isGlampping: 'true' })
        .subscribe(
          (respones: GlampingCoupon) => {
            this.glampingCoupon = respones;
            this.toastService.show('Promo Code Applied Successfully.', {
              classname: 'bg-success text-light',
              delay: 3000,
            });
            if (this.glampingCoupon.total) {
              this.hidePayment = false;
            } else {
              this.hidePayment = true;
            }
          },
          (err) => {
            this.hidePayment = false;
            this.glampingCoupon = undefined;
            this.show.loading = false;
            this.isPaymentDone = false;
            this.toastService.show((err || {}).error.errorMessage || 'Something went wrong!', {
              classname: 'bg-danger text-light',
              delay: 3000,
            });
          },
        );
    } else {
      if (this.glampingCoupon) {
        this.hidePayment = false;
        this.toastService.show('Promo Code Removed Successfully.', {
          classname: 'bg-success text-light',
          delay: 3000,
        });
        this.glampingCoupon = undefined;
      } else {
        this.hidePayment = false;
        this.toastService.show('Please enter promo code.', {
          classname: 'bg-danger text-light',
          delay: 3000,
        });
      }
    }
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

  formElementEnter() {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'glamping_payment',
        promocode: this.promocode,
      });
    }
  }
  formElementExit() {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'glamping_payment',
      promocode: this.promocode,
    });
  }
}
