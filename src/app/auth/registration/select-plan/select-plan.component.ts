import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { VirtualChallengeDataService } from '@core/data';
import { UserInfo } from '@core/interfaces/auth.interface';
import { VirtualChallengeDetail } from '@core/interfaces/virtual-challenge.interface';
import {
  LocalStorageService,
  SessionStorageService,
  virtualChallengeRoutes,
  sessionStorageConstant,
  registrationRoutes,
  authRoutes,
} from '@core/utils';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.scss'],
})
export class SelectPlanComponent implements OnInit {
  public show = {
    pageLoading: false,
  };

  public userData = new UserInfo();
  public challengeDetail: VirtualChallengeDetail;

  public plan = {
    SWAG: null,
    REGISTRATION: null,
  };
  public params: { id: string };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private virtualChallengeDataService: VirtualChallengeDataService,
  ) {}

  ngOnInit(): void {
    this.params = { id: '' };
    this.route.paramMap.subscribe((queryParams: ParamMap) => {
      this.params.id = queryParams.get('id');
    });
    this.sessionStorageService.flushAll();

    this.userData = this.localStorageService.getUser();

    if (this.userData) {
      this.show.pageLoading = true;
      this.checkUserChallenge(this.userData);
      // this.getChallengeInfo(this.params.id);
    } else {
      this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`]);
    }
  }

  checkUserChallenge(user) {
    this.show.pageLoading = true;
    this.virtualChallengeDataService.getUserExistingChallenge(user.id).subscribe(
      (response) => {
        const challenge = response;
        if (response && response.challengeType === 'BRAND' && challenge.challengeSubType === 'OBF' && !response.isChallengeCompleted) {
          this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
        } else {
          this.getChallengeInfo(this.params.id);
        }
      },
      (error) => {
        this.getChallengeInfo(this.params.id);
      },
    );
  }

  getChallengeInfo(challengeId) {
    this.virtualChallengeDataService.getByid(challengeId).subscribe(
      (response) => {
        const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
        this.challengeDetail = response;

        this.challengeDetail.eCommerce.map((eCommerce) => {
          if (today.isAfter(moment.utc(eCommerce.content.soldOutDate))) {
            eCommerce.content.isSoldOut = 1;
          }
        });
        this.plan.SWAG = this.challengeDetail.eCommerce.find((e) => e.type === 'SWAG');
        this.plan.REGISTRATION = this.challengeDetail.eCommerce.find((e) => e.type === 'REGISTRATION');
        this.sessionStorageService.set(sessionStorageConstant.virtualChallengeInfo, response);
        this.show.pageLoading = false;
      },
      (error) => {},
    );
  }

  upgradePlan(eCommerce) {
    this.sessionStorageService.set(sessionStorageConstant.virtualChallengeSelectedPlan, [eCommerce]);
    this.router.navigate([
      `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeDetail.id}/${registrationRoutes.personalInfo}`,
    ]);
  }
}
