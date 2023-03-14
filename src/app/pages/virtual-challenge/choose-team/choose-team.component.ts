import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastService } from '@components/toast/toast.service';
import {
  VirtualChallengeInviteDataService,
  VirtualChallengeTeamDataService,
  VirtualChallengeDataService,
  AuthDataService,
} from '@core/data';
import { UserInfo } from '@core/interfaces/auth.interface';
import { VirtualChallengeDetail, VirtualChallengeMember, VirtualChallengeTeam } from '@core/interfaces/virtual-challenge.interface';
import { DataLayerService, LocalStorageService, sessionStorageConstant, SessionStorageService, virtualChallengeRoutes } from '@core/utils';
import lodashCloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-choose-team',
  templateUrl: './choose-team.component.html',
  styleUrls: ['./choose-team.component.scss'],
})
export class ChooseTeamComponent implements OnInit {
  private params: { id: string };
  public userData = new UserInfo();
  public invitedByName = '';
  public totalTeams: VirtualChallengeTeam[];
  public teamRunners: (VirtualChallengeMember & { alreadyJoined?: boolean })[];
  public selectedTeamID = '';
  public selectedTeam: VirtualChallengeTeam;
  public challengeDetail: VirtualChallengeDetail;
  public routes = virtualChallengeRoutes;
  constructor(
    private route: ActivatedRoute,
    private virtualChallengeDataService: VirtualChallengeDataService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private virtualChallengeTeamDataService: VirtualChallengeTeamDataService,
    private virtualChallengeInviteDataService: VirtualChallengeInviteDataService,
    private toastService: ToastService,
    private dataLayerService: DataLayerService,
    private authDataService: AuthDataService,
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'virtual-challenge-choose-team',
      pagePostType: 'virtualChallengeChooseTeam',
      pagePostType2: 'single-page',
    });
    this.params = { id: '' };
    this.userData = this.localStorageService.getUser();
    this.invitedByName =
      this.userData.firstName && this.userData.lastName
        ? this.userData.firstName + ' ' + this.userData.lastName
        : this.userData.firstName
        ? this.userData.firstName
        : this.userData.emailAddress;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.params.id = params.get('id');
    });
    this.challengeDetail = this.sessionStorageService.get(sessionStorageConstant.virtualChallengeInfo);
    this.checkTeamAlreadyExists();
    this.getChallengeTeams();
  }

  checkTeamAlreadyExists() {
    this.virtualChallengeTeamDataService.getChallengeByProfile(this.userData.id).subscribe(
      (response) => {
        if (response && !response.isChallengeCompleted) {
          this.router.navigate([`${this.routes.main}/${this.routes.DcDashboard}`]);
        }
      },
      (error) => {},
    );
  }

  getChallengeTeams() {
    this.virtualChallengeTeamDataService.getUserProfileTeams(this.userData.id).subscribe(
      (response) => {
        this.totalTeams = response;
      },
      (error) => {},
    );
  }
  chooseTeam(teamId, team) {
    this.teamRunners = [];
    this.selectedTeam = team;
    this.selectedTeamID = teamId;
    this.virtualChallengeTeamDataService.getRunnersFromTeam(teamId).subscribe(
      (response) => {
        this.teamRunners = response;
      },
      (error) => {},
    );
  }
  inviteBulkRunners(challengeTeamID) {
    const inviteDetails = this.teamRunners
      .filter((f) => !f.alreadyJoined)
      .map((m) => {
        return {
          challengeId: this.params.id,
          challengeTeamId: challengeTeamID,
          email: m.email,
          message: ' ',
        };
      });
    this.virtualChallengeInviteDataService.createBulk(this.params.id, challengeTeamID, inviteDetails, this.invitedByName, false).subscribe(
      () => {
        this.navigateToNextPage();
      },
      (err) => {
        console.error(err);
        this.toastService.show(err?.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        this.router.navigate([`${this.routes.main}/${this.routes.DcDashboard}`]);
      },
    );
  }
  createTeam(flag) {
    const teamName =
      this.selectedTeam && flag === 'invite'
        ? this.selectedTeam.teamName
        : this.userData.firstName.match(/s$/g)
        ? this.userData.firstName + `'`
        : this.userData.firstName + `'s`;
    const teamDetails = {
      challengeId: this.params.id,
      name: teamName,
      profileId: this.userData.id,
      email: this.userData.emailAddress,
      waiverSnapshot: this.challengeDetail.contents.INFO_PAGE.waiver,
    };
    // this.challengeDetail.contents.WAIVER ?
    // this.challengeDetail.contents.WAIVER.waiver : this.challengeDetail.contents.INFO_PAGE.waiver

    this.virtualChallengeTeamDataService.create(teamDetails).subscribe(
      (response) => {
        const userData = this.sessionStorageService.get(sessionStorageConstant.userInfo);
        this.saveAccountSettings(userData);
        if (this.selectedTeam && flag === 'invite') {
          this.inviteBulkRunners(response.id);
        } else {
          this.navigateToNextPage();
        }
      },
      (err) => {
        console.error('InfoComponent -> createTeam -> error', err);
        this.toastService.show(err?.error.message, { classname: 'bg-dark text-light', delay: 3000 });
        if (err.error.code === 'OTHER_ACTIVE_CHALLENGE' && err.status === 422) {
          if (this.challengeDetail.unitType === 'ACTIVITY') {
            this.router.navigate([`${this.routes.main}/${this.routes.DcDashboard}`]);
          } else {
            this.router.navigate([`${this.routes.main}/${this.routes.dashboard}`]);
          }
        }
      },
    );
  }

  saveAccountSettings(userFormData) {
    const userData = lodashCloneDeep(userFormData);
    this.authDataService.updateUser(userData).subscribe(
      (updatedUserData) => {
        this.localStorageService.saveUser(updatedUserData);
      },
      (err) => {
        console.error(err);
        // ctrl.blockUI.stop();
      },
    );
  }

  navigateToNextPage(): void {
    this.virtualChallengeDataService.getVirtualChallange(this.params.id).subscribe((challenge) => {
      if (challenge.unitType === 'ACTIVITY') {
        this.router.navigate([`${this.routes.main}/${this.routes.DcDashboard}`]);
      } else {
        this.router.navigate([`${this.routes.main}/${this.routes.dashboard}`]);
      }
    });
  }
}
