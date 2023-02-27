import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthDataService,
  VirtualChallengeDataService,
  VirtualChallengeTeamDataService,
  VirtualChallengeMemberDataService,
  VirtualChallengeInviteDataService,
  VirtualChallengeCommunityService,
  VirtualChallengeUtilDataService,
  VirtualChallengeNotificationService,
  AuthorizeNetService,
  RagnarCMSDataService,
  StaticPageService,
  RCMSEventDataService,
  TeamCenterDataService,
  ProfileRcmsDataService,
  NewVisitorService,
} from './index';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthInterceptor } from './interceptors/add-header.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

const DataServices = [
  AuthDataService,
  VirtualChallengeDataService,
  VirtualChallengeTeamDataService,
  VirtualChallengeMemberDataService,
  VirtualChallengeCommunityService,
  VirtualChallengeInviteDataService,
  VirtualChallengeUtilDataService,
  VirtualChallengeNotificationService,
  AuthorizeNetService,
  RagnarCMSDataService,
  StaticPageService,
  RCMSEventDataService,
  TeamCenterDataService,
  ProfileRcmsDataService,
  NewVisitorService,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    ...DataServices,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
})
export class DataModule {}
