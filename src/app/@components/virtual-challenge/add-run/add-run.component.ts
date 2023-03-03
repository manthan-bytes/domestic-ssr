import { Component, OnInit, Input, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModelDialogComponent } from '../common-model-dialog/common-model-dialog.component';

import * as moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';
import { TranslateService } from '@ngx-translate/core';
import { VirtualChallengeUtilDataService } from 'src/app/@core/data';
import { UserInfo } from 'src/app/@core/interfaces/auth.interface';
import { VirtualChallengeDetail, VirtualChallengeTeam, VirtualChallengeRunLogs, AddedActivityCopy } from 'src/app/@core/interfaces/virtual-challenge.interface';
import { VirtualChallengeSharedDataService, XMomentService, DataLayerService } from 'src/app/@core/utils';
import { ToastService } from '../../toast/toast.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-virtual-challenge-add-run',
  templateUrl: './add-run.component.html',
  styleUrls: ['./add-run.component.scss'],
})
export class AddRunComponent implements OnInit {
  @Input() challengeDetails: VirtualChallengeDetail;
  @Input() teamDetail: VirtualChallengeTeam & { achieved_run?: number };
  @Input() runLogs: VirtualChallengeRunLogs[];
  @Input() editActivityCopy: AddedActivityCopy;
  @Output() getLeaderBoardData = new EventEmitter();
  @Output() getLogsAndLeaderBoard = new EventEmitter();

  public show = {
    headText: 'Record Mileage',
    mileInput: false,
    loading: false,
    challengeOver: false,
    isEditMile: false,
    showLinkError: false,
    updatedFrom: '',
  };

  public userData: UserInfo = null;
  public userProfileData = JSON.parse(localStorage.getItem('profilesUser'));
  public addedRun = {
    tempRun: null,
    run: null,
    link: null,
  };

  public memberRunDetails;

  private editMileDetail;
  public mileBeforeUpdate = 0;
  public inputFocusCount = 0;
  public addRunNumber: number;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private virtualChallengeUtilDataService: VirtualChallengeUtilDataService,
    private virtualChallengeSharedDataService: VirtualChallengeSharedDataService,
    private translate: TranslateService,
    private xMomentService: XMomentService,
    public dataLayerService: DataLayerService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.runLogs = this.virtualChallengeSharedDataService.checkRunLogs(this.runLogs);

    if (this.editActivityCopy && this.editActivityCopy.addedActivity) {
      this.editMile(this.editActivityCopy.addedActivity);
    }
    this.translate.setDefaultLang('en');
  }

  showChallengeProgress() {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'challenge_progress',
    });

    modalRef.componentInstance.componentData = {
      type: 'challengeProgress',
      title: 'Challenge Progress',
      progressDetails: this.memberRunDetails,
    };

    modalRef.result.then(
      (result) => {
        if (isPlatformBrowser(this.platformId)) {
          window.location.hash = 'dashboard';
        }
      },
      (reason) => {},
    );
  }

  /* mileCheck() {
    const stringNumber = (document.getElementById('addRun') as HTMLInputElement).value;
    const parseFloatNumber = parseFloat(stringNumber);

    if (stringNumber.match(/[a-zA-Z-]/)) {
      (document.getElementById('addRun') as HTMLInputElement).value = this.addedRun.run || '';
    } else if (stringNumber.replace(/[^.]/g, '').length > 1) {
      (document.getElementById('addRun') as HTMLInputElement).value = (stringNumber || '').replace('..', '.');
      if (stringNumber.split('.').length === 3) {
        (document.getElementById('addRun') as HTMLInputElement).value = stringNumber.split('.').splice(0, 2).join('.');
        this.addedRun.run = Number(stringNumber.split('.').splice(0, 2).join('.'));
      }
    } else {
      let remainingRun = this.teamDetail.total_run - this.teamDetail.achieved_run;
      if (this.show.isEditMile) {
        remainingRun = this.editMileDetail.unit + remainingRun;
      }
      if (parseFloatNumber > remainingRun) {
        if (parseFloatNumber / 10 < this.teamDetail.total_run && stringNumber.split('.').length !== 2) {
          (document.getElementById('addRun') as HTMLInputElement).value = (parseFloatNumber / 10).toString();
          this.addedRun.run = parseFloatNumber / 10;
        } else {
          (document.getElementById('addRun') as HTMLInputElement).value = remainingRun.toString();
          this.addedRun.run = remainingRun;
        }
      } else {
        if (!isNaN(parseFloatNumber)) {
          this.addedRun.run = parseFloatNumber;
          if (stringNumber.split('.').length === 2) {
            const splited = [stringNumber.split('.')[0], stringNumber.split('.')[1].slice(0, 2)].join('.');
            (document.getElementById('addRun') as HTMLInputElement).value = splited;
            this.addedRun.run = parseFloat(splited);
          }
        } else {
          this.addedRun.run = parseFloatNumber;
        }
      }
    }
    this.addRunBtnDisable('addRun');
  } */

  mileCheck() {
    const stringNumber = (document.getElementById('addRun') as HTMLInputElement).value;
    const parseFloatNumber = parseFloat(stringNumber);

    if (stringNumber.match(/[a-zA-Z-]/)) {
      (document.getElementById('addRun') as HTMLInputElement).value = this.addedRun.run || '';
    } else if (stringNumber.replace(/[^.]/g, '').length > 1) {
      (document.getElementById('addRun') as HTMLInputElement).value = (stringNumber || '').replace('..', '.');
      if (stringNumber.split('.').length === 3) {
        (document.getElementById('addRun') as HTMLInputElement).value = stringNumber.split('.').splice(0, 2).join('.');
        this.addedRun.run = Number(stringNumber.split('.').splice(0, 2).join('.'));
      }
    } else {
      if (parseFloatNumber > 39.01) {
        if (parseFloatNumber / 10 < 39.01 && stringNumber.split('.').length !== 2) {
          (document.getElementById('addRun') as HTMLInputElement).value = (parseFloatNumber / 10).toString();
          this.addedRun.run = parseFloatNumber / 10;
        } else {
          (document.getElementById('addRun') as HTMLInputElement).value = '39';
          this.addedRun.run = 39;
        }
      } else {
        if (!isNaN(parseFloatNumber)) {
          this.addedRun.run = parseFloatNumber;
          if (stringNumber.split('.').length === 2) {
            const splited = [stringNumber.split('.')[0], stringNumber.split('.')[1].slice(0, 2)].join('.');
            (document.getElementById('addRun') as HTMLInputElement).value = splited;
            this.addedRun.run = parseFloat(splited);
          }
        } else {
          this.addedRun.run = parseFloatNumber;
        }
      }
    }
    this.addRunBtnDisable('addRun');
  }

  addRunBtnDisable(key) {
    switch (key) {
      case 'addRun':
        if (this.addedRun.run >= 13) {
          (document.getElementById('addRunLink') as HTMLInputElement).placeholder = 'Required: Link To Public Activity (e.g. Strava)';
          (document.getElementById('addRunBtn') as HTMLInputElement).disabled = true;
          this.addRunLinkValidation();
        } else if (this.addedRun.run) {
          (document.getElementById('addRunLink') as HTMLInputElement).placeholder = 'Optional: Link To Public Activity (e.g. Strava)';
          (document.getElementById('addRunBtn') as HTMLInputElement).disabled = false;
          this.show.showLinkError = false;
        }
        break;
      case 'addLink':
        (document.getElementById('addRunBtn') as HTMLInputElement).disabled = false;
        break;
      default:
        break;
    }
  }

  addRunLinkValidation() {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator

    const allowActivityLink = ['strava.app.link/', 'connect.garmin.com/modern/activity/', 'strava.com/activities/'];

    if (this.addedRun.link && this.addedRun.run) {
      const matchAllowLink =
        allowActivityLink
          .map((str) => str.split(' '))
          .filter((arrtemp) => arrtemp.filter((strin) => this.addedRun.link.indexOf(strin) > -1).length === arrtemp.length).length > 0;
      if (!!pattern.test(this.addedRun.link) && matchAllowLink) {
        this.show.showLinkError = false;
        this.addRunBtnDisable('addLink');
      } else {
        this.show.showLinkError = true;
      }
      allowActivityLink.forEach((link) => {});
    } else if (!this.addedRun.link && this.addedRun.run < 13) {
      this.show.showLinkError = false;
    } else if (!this.addedRun.link && this.addedRun.run >= 13) {
      this.show.showLinkError = true;
      (document.getElementById('addRunBtn') as HTMLInputElement).disabled = true;
    } else {
      this.show.showLinkError = false;
      (document.getElementById('addRunBtn') as HTMLInputElement).disabled = true;
    }
  }

  addRun() {
    const addRunDetail = {
      challengeId: this.challengeDetails.id,
      challengeTeamId: this.challengeDetails.challengeTeamId,
      challengeMemberId: this.challengeDetails.challengeMemberId,
      unit: parseFloat(this.addedRun.run),
      content: {
        activityLink: this.addedRun.link,
      },
      stravaActivityId: '',
    };
    this.show.loading = true;
    this.virtualChallengeUtilDataService.addActivity(addRunDetail).subscribe(
      (response) => {
        if (this.challengeDetails.challengeType === 'TEAM') {
          const like = {};
          like[`${this.userProfileData.data.id}`] = false;
          const feedDetails = {
            createdBy: this.userProfileData.data.id,
            createdAt: this.xMomentService.defaultTime().toISOString(),
            profileId: this.userProfileData.data.id,
            loggedMile: response.unit,
            likes: like,
          };
        }
        this.getLeaderBoardData.next({ type: 'addedRun', addedActivity: response });
      },
      (err) => {
        this.show.loading = false;
        if (err.error.code && err.error.code === 'CHALLENGE_IS_OVER') {
          this.show.challengeOver = true;
          this.show.mileInput = false;
          this.show.headText = 'Record Mileage';
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
          this.getLeaderBoardData.next(null);
        } else if (err.error.code && (err.error.code === 'MAX_ACTIVITY_LIMIT_REACHED' || err.error.code === 'MAX_ACTIVITY_MILES_REACHED')) {
          this.show.mileInput = false;
          this.show.headText = 'Record Mileage';
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        } else {
          this.toastService.show('Something went wrong. Try again after few minutes!', { classname: 'bg-dark text-light', delay: 3000 });
        }
      },
    );
  }

  editMile(mileDetail, index?) {
    this.editMileDetail = mileDetail;
    this.show.isEditMile = true;
    if (index >= 0) {
      this.show.updatedFrom = 'editMile';
    } else {
      this.show.updatedFrom = 'addMile';
    }
    this.show.headText = 'Update Mileage';
    this.addedRun.run = mileDetail.unit;
    this.addedRun.link = mileDetail.content.activityLink;
    this.show.mileInput = true;
    (document.getElementById('addRun') as HTMLInputElement).value = mileDetail.unit;
    this.mileBeforeUpdate = mileDetail.unit;
    this.addRunBtnDisable('addRun');
  }

  updateRun() {
    const clonedMile = cloneDeep(this.editMileDetail.unit);
    this.editMileDetail.unit = parseFloat(this.addedRun.run);
    this.editMileDetail.content = {
      activityLink: this.addedRun.link,
    };
    this.show.loading = true;
    this.virtualChallengeUtilDataService.updateActivity(this.editMileDetail).subscribe(
      (response) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'add_run',
          formStatus: this.dataLayerService.formStatus.SUCCESS,
          addRun: this.addRunNumber,
          addRunLink: this.addedRun.link,
        });
        response.prevMile = this.mileBeforeUpdate;
        if (this.show.updatedFrom === 'editMile') {
          this.getLeaderBoardData.next({ type: 'updatedRunFromEdit', addedActivity: response });
        } else if (this.show.updatedFrom === 'addMile') {
          this.getLeaderBoardData.next({ type: 'updatedRunAfterAdd', addedActivity: response });
        }
      },
      (err) => {
        this.dataLayerService.formSubmitEvent({
          formName: 'add_run',
          formStatus: this.dataLayerService.formStatus.FAILED,
          addRun: this.addedRun.run,
          addRunLink: this.addedRun.link,
        });
        this.show.loading = false;
        this.editMileDetail.unit = clonedMile;
        if (err.error.code && err.error.code === 'ACTIVITY_TIME_LIMIT_REACHED') {
          this.show.mileInput = false;
          this.show.headText = 'Record Mileage';
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
          this.getLeaderBoardData.next(null);
        } else if (err.error.code && (err.error.code === 'MAX_ACTIVITY_LIMIT_REACHED' || err.error.code === 'MAX_ACTIVITY_MILES_REACHED')) {
          this.show.mileInput = false;
          this.show.headText = 'Record Mileage';
          this.toastService.show(err.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        } else {
          this.toastService.show('Something went wrong. Try again after few minutes!', { classname: 'bg-dark text-light', delay: 3000 });
        }
      },
    );
  }

  deleteRun(activity) {
    const modalRef = this.modalService.open(CommonModelDialogComponent, {
      scrollable: true,
      centered: true,
      keyboard: false,
      backdrop: 'static',
      windowClass: 'delete_modal',
    });
    const shortTitle = this.challengeDetails.unitType === 'ELEVATION' ? 'ft climb' : 'mi run';
    const bigTitle = this.challengeDetails.unitType === 'ELEVATION' ? 'foot climb' : ' mile run';
    modalRef.componentInstance.componentData = {
      type: 'deleteActivity',
      title: `Delete ${activity.unit} ${shortTitle}?`,
      details: {
        description: `Do you really want to delete your ${activity.unit} ${bigTitle} from ${moment
          .utc(activity.logDate)
          .format('MMM Do')}? This cannot be undone.`,
        btnText: `${activity.unit} ${shortTitle}`,
        activityId: activity.id,
      },
    };

    modalRef.result.then(
      (result) => {
        if (result) {
          this.getLogsAndLeaderBoard.next(null);
          this.getLeaderBoardData.next({ type: 'deletedRun', addedActivity: { unit: activity.unit } });
        }
      },
      (reason) => {},
    );
  }
  formElementEnter(form) {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'add_run',
        addRun: this.addRunNumber,
        addRunLink: this.addedRun.link,
      });
    }
  }
  formElementExit(form) {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'add_run',
      addRun: this.addRunNumber,
      addRunLink: this.addedRun.link,
    });
  }
}
