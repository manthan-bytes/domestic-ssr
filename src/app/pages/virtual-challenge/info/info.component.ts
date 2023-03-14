import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VirtualChallengeDataService, VirtualChallengeTeamDataService, VirtualChallengeMemberDataService } from '@core/data';
import {
  virtualChallengeRoutes,
  authRoutes,
  registrationRoutes,
  StaticPageRoutes,
  staticRoutes,
} from '@core/utils/routes-path.constant.service';
import { VirtualChallengeDetail } from '@core/interfaces/virtual-challenge.interface';
import {
  LocalStorageService,
  localStorageConstant,
  MetaTagsService,
  SessionStorageService,
  sessionStorageConstant,
  DataLayerService,
  XMomentService,
} from '@core/utils';
import { UserInfo } from '@core/interfaces/auth.interface';
import { ToastService } from '@components/toast/toast.service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment-timezone';
import { CommonModelDialogComponent } from '@components/virtual-challenge/common-model-dialog/common-model-dialog.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  public routes = virtualChallengeRoutes;
  public staticPageRoutes = StaticPageRoutes;

  private challengeId;
  public challengeDetail: VirtualChallengeDetail;

  // private params;

  public userData: UserInfo = null;

  public show = {
    loading: false,
    isChallengeOver: false,
    isRegistrationClose: false,
  };
  params;
  isSWAGEdition = false;
  public isAcceptInvite: boolean;
  public challengeStartDate: any;
  public challengeEndDate: any;

  constructor(
    public sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private virtualChallengeTeamDataService: VirtualChallengeTeamDataService,
    private virtualChallengeMemberDataService: VirtualChallengeMemberDataService,
    private metaTagsServices: MetaTagsService,
    private toastService: ToastService,
    private sessionStorageService: SessionStorageService,
    private modalService: NgbModal,
    private dataLayerService: DataLayerService,
    private xMomentService: XMomentService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      if (params.challengeId) {
        this.challengeId = params.challengeId;
        this.isAcceptInvite = params.isAcceptInvite;
        this.getChallengeInfo();
        this.userData = this.localStorageService.getUser() || null;
        this.checkUserChallenge(this.userData);
        this.addDataLayer();
      } else {
        this.router.navigate([`/${staticRoutes.pageNotFound}`]);
      }
    });
  }

  checkUserChallenge(userData) {
    this.show.loading = true;
    if (userData) {
      this.virtualChallengeDataService.getUserExistingChallenge(userData.id).subscribe(
        (response) => {
          this.show.loading = false;
          if (+response.isChallengeCompleted === 0) {
            if (response.challengeType === 'BRAND' && this.challengeId === response.id) {
              this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
            } else {
              if (response.unitType === 'ACTIVITY') {
                if (this.isAcceptInvite) {
                  this.toastService.show('MEMBER ALREADY IN OTHER CHALLENGE', { classname: 'bg-dark text-light', delay: 3000 });
                }
                this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.DcDashboard}`]);
              } else {
                response.isAlreadyRun
                  ? this.getChallengeInfo()
                  : this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.dashboard}`]);
              }
            }
          } else {
            this.show.loading = false;
            this.getChallengeInfo();
          }
        },
        (error) => {
          this.show.loading = false;
          this.getChallengeInfo();
        },
      );
    } else {
      this.getChallengeInfo();
    }
  }

  getChallengeInfo() {
    this.show.loading = true;
    this.virtualChallengeDataService.getByid(this.challengeId).subscribe(
      (response) => {
        const today = moment(moment.tz(moment().utc(false), 'America/Denver').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
        const startDate = moment(moment(response.startDate).startOf('D').format('YYYY-MM-DDTHH:mm:ss') + '.000Z').utc();
        // response.startDate = startDate.toISOString();
        // response.endDate = moment(response.endDate).toISOString();
        const days = today.diff(startDate, 'days') + 1;
        this.challengeDetail = response;
        this.metaTagsServices.setTitle(
          `Ragnar Virtual Challenge | ${this.challengeDetail.name} | ${this.challengeDetail.contents.INFO_PAGE.subTitle}`,
        );
        this.metaTagsServices.setSiteMetaTags(
          'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running, virtual challenge',
        );
        this.sessionStorageService.set(sessionStorageConstant.virtualChallengeInfo, response);
        if (this.challengeDetail.challengeType === 'COMMUNITY') {
          this.sessionStorageService.set(sessionStorageConstant.virtualChallengeSelectedPlan, this.challengeDetail.eCommerce);
        }

        if (this.challengeDetail.challengeType !== 'TEAM' && days > this.challengeDetail.maxDays) {
          this.show.isChallengeOver = true;
        }

        if (
          today.isAfter(moment.utc(this.challengeDetail.contents.INFO_PAGE.registrationCloseDate)) &&
          this.challengeDetail.challengeType === 'BRAND'
        ) {
          this.show.isRegistrationClose = true;
        }

        this.challengeDetail.eCommerce.map((eCommerce) => {
          if (today.isAfter(moment.utc(eCommerce.content.soldOutDate))) {
            eCommerce.content.isSoldOut = 1;
          }
        });
        this.show.loading = false;
      },
      (error) => {
        this.show.loading = false;
      },
    );
  }

  joinChallenge(flow?: 'JOIN' | 'INVITE' | 'NEW-TEAM', offerDeclined: boolean = false) {
    this.isSWAGEdition = this.challengeDetail.eCommerce.length > 0;
    if (!this.userData) {
      if (this.isSWAGEdition && this.challengeDetail.challengeType !== 'COMMUNITY') {
        this.localStorageService.set(
          localStorageConstant.redirectTo,
          `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeId}/${registrationRoutes.selectPlan}`,
        );
      } else {
        if (flow === 'NEW-TEAM') {
          this.localStorageService.set(
            localStorageConstant.redirectTo,
            `/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}}?challengeId=${this.challengeId}`,
          );
        } else {
          this.localStorageService.set(
            localStorageConstant.redirectTo,
            `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeDetail.id}/${registrationRoutes.personalInfo}`,
          );
        }
        if (flow === 'INVITE') {
          this.localStorageService.set('challengeTeamId', this.params.challengeTeamId);
        }
      }
      this.router.navigate([`/${authRoutes.main}/${authRoutes.login}`]);
      return;
    } else {
      if (this.isSWAGEdition && this.challengeDetail.challengeType !== 'COMMUNITY') {
        this.router.navigate([
          `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeId}/${registrationRoutes.selectPlan}`,
        ]);
      } else {
        this.sessionStorageService.set(sessionStorageConstant.virtualChallengeSelectedPlan, this.challengeDetail.eCommerce);
        if (flow === 'INVITE') {
          this.router.navigate(
            [
              `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeDetail.id}/${registrationRoutes.personalInfo}`,
            ],
            {
              queryParams: {
                challengeTeamId: this.params.challengeTeamId || false,
              },
            },
          );
        } else {
          if (offerDeclined === false) {
            if (flow === 'NEW-TEAM') {
              this.router.navigate([`/${virtualChallengeRoutes.main}/${virtualChallengeRoutes.info}`], {
                queryParams: {
                  challengeId: this.challengeId || false,
                },
              });
            } else {
              this.router.navigate([
                `/${authRoutes.main}/${registrationRoutes.main}/${registrationRoutes.virtualChallenge}/${this.challengeDetail.id}/${registrationRoutes.personalInfo}`,
              ]);
            }
          } else {
            this.declineInvitation();
            // this.router.navigate([`${this.routes.main}/${this.routes.home}`]);
          }
        }
      }
    }
    // if (!this.params.temaId) {
    //   this.createTeam();
    // } else {
    //   const teamDetail = {
    //     id: this.params.temaId,
    //   };
    //   this.createMember(teamDetail, false);
    // }

    this.dataLayerService.eCommerceAddToCartItemEvent({
      item_name: this.challengeDetail.name, // race name
      item_id: `${this.challengeDetail.id}`, //race ID
      price: '', //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: this.challengeDetail.challengeType === 'relay' ? 'road' : this.challengeDetail.challengeType,
      item_category2: this.challengeDetail.startDate, // we can use this for the race geolocation
      item_category3: this.challengeDetail.endDate, //any other specification
      item_category4: this.challengeDetail.unitType, //any other specification
      item_variant: '', // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }

  createTeam() {
    const teamDetails = {
      challengeId: this.challengeId,
      name: 'Test TEam 02',
      profileId: this.userData.id,
    };

    this.virtualChallengeTeamDataService.create(teamDetails).subscribe(
      (response) => {
        // this.createMember(response, true);
      },
      (error) => {
        console.error('InfoComponent -> createTeam -> error', error);
      },
    );
  }

  createMember(teamDetail, isInitiator) {
    const memberDetails = {
      challengeId: this.challengeId,
      challengeTeamId: teamDetail.id,
      profileId: this.userData.id,
      email: this.userData.emailAddress,
      first_name: `${this.userData.firstName} ${this.userData.lastName}`,
      role: isInitiator ? 'CAPTAIN' : 'MEMBER',
    };

    this.virtualChallengeMemberDataService.create(memberDetails).subscribe(
      (response) => {
        this.router.navigate([`${this.routes.main}/${this.routes.dashboard}`]);
      },
      (error) => {
        console.error('InfoComponent -> createTeam -> error', error);
      },
    );
  }

  declineInvitation() {
    this.virtualChallengeTeamDataService.getByid(this.params.challengeTeamId).subscribe((response) => {
      const modalRef = this.modalService.open(CommonModelDialogComponent, {
        scrollable: true,
        centered: true,
        keyboard: false,
        backdrop: 'static',
        windowClass: 'challenge_progress',
      });

      modalRef.componentInstance.componentData = {
        type: 'declineInvitation',
        title: 'Decline Invitation',
        changeTeamName: response.name,
      };

      modalRef.result.then((result) => {
        if (result === 'NEW-TEAM') {
          this.joinChallenge('NEW-TEAM');
        } else if (result === 'INVITE') {
          this.joinChallenge('INVITE');
        }
      });
    });
  }

  addDataLayer() {
    this.dataLayerService.pageInitEvent({
      screen_name: 'virtual-challenge-info',
      pagePostType: 'virtualChallengeInfo',
      pagePostType2: 'single-page',
    });

    this.virtualChallengeDataService.getByid(this.challengeId).subscribe((res) => {
      if (res.id) {
        this.dataLayerService.eCommerceSelectItemEvent({
          item_name: res.name, // race name
          item_id: `${res.id}`, //race ID
          price: '', //race price
          item_brand: 'ragnar', // we can use runragnar, or any other specification
          item_category: res.challengeType === 'relay' ? 'road' : res.challengeType, // we can use this for race type for example
          item_category2: res.startDate, // we can use this for the race geolocation
          item_category3: res.endDate, //any other specification
          item_category4: res.unitType, //any other specification
          item_variant: '', // we can use this for example the team type
          quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
        });

        this.dataLayerService.eCommerceViewItemEvent({
          item_name: res.name, // race name
          item_id: `${res.id}`, //race ID
          price: '', //race price
          item_brand: 'ragnar', // we can use runragnar, or any other specification
          item_category: res.challengeType === 'relay' ? 'road' : res.challengeType, // we can use this for race type for example
          item_category2: res.startDate, // we can use this for the race geolocation
          item_category3: res.endDate, //any other specification
          item_category4: res.unitType, //any other specification
          item_variant: '', // we can use this for example the team type
          quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
        });
      }
    });
  }
}
