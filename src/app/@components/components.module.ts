import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
// import { FooterComponent } from './footer/footer.component';
import { VirtualUpSellModalComponent } from './virtual-challenge/virtual-up-sell-modal/virtual-up-sell-modal.component';
import { MemberRunStatusComponent } from './virtual-challenge/member-run-status/member-run-status.component';
import { CommonModelDialogComponent } from './virtual-challenge/common-model-dialog/common-model-dialog.component';
import { WaiverModalComponent } from './virtual-challenge/waiver-modal/waiver-modal.component';
import { LeaderBoardComponent } from './virtual-challenge/leader-board/leader-board.component';
import { ActivityFeedComponent } from './virtual-challenge/activity-feed/activity-feed.component';
import { TeamInfoComponent } from './virtual-challenge/team-info/team-info.component';
import { CommunityComponent } from './virtual-challenge/community/community.component';
import { AddRunComponent } from './virtual-challenge/add-run/add-run.component';
import { AssignLegComponent } from './virtual-challenge/assign-leg/assign-leg.component';
import { CoreModule } from '@core/core.module';
import { RoundProgressBarComponent } from './virtual-challenge/round-progress-bar/round-progress-bar.component';
import { ToastsContainerComponent } from './toast/toast-container.component';
import { ToastService } from './toast/toast.service';
import { RouterModule } from '@angular/router';
import { HeaderRacesComponent } from './header-races/header-races.component';
import { VirtualChallengeFooterComponent } from './virtual-challenge/footer/footer.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormControlComponent } from './form-control/form-control.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ImageCropComponent } from './image-crop/image-crop.component';
import { CountDownComponent } from './virtual-challenge/countdown/countdown.component';
import { AddLatestActivityComponent } from './virtual-challenge/add-latest-activity/add-latest-activity.component';
import { InviteModalComponent } from './virtual-challenge/invite-modal/invite-modal.component';
import { FaqModalComponent } from './virtual-challenge/faq-modal/faq-modal.component';
import { TeamStatsComponent } from './virtual-challenge/team-stats/team-stats.component';
import { RagnarNationComponent } from './virtual-challenge/ragnar-nation/ragnar-nation.component';
import { BadgeAchievementModalComponent } from './virtual-challenge/badge-achievement-modal/badge-achievement-modal.component';
import { Footerv2Component } from './footerv2/footerv2.component';
import { TestimonialsComponent } from './testimonals/testimonials.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NewUserPopupComponent } from './new-user-popup/new-user-popup.component';
import { ThankyouPopUpComponent } from './new-user-popup/thankyou-popup/thankyou-popup.component';
const MODULES = [NgbModule, ImageCropperModule];

const COMPONENTS = [
  HeaderComponent,
  NewUserPopupComponent,
  ThankyouPopUpComponent,
  PageNotFoundComponent,
  Footerv2Component,
  VirtualUpSellModalComponent,
  MemberRunStatusComponent,
  CommonModelDialogComponent,
  LeaderBoardComponent,
  WaiverModalComponent,
  ActivityFeedComponent,
  TeamInfoComponent,
  CommunityComponent,
  AddRunComponent,
  AssignLegComponent,
  RoundProgressBarComponent,
  ToastsContainerComponent,
  HeaderRacesComponent,
  VirtualChallengeFooterComponent,
  ImageCropComponent,
  CountDownComponent,
  AddLatestActivityComponent,
  TeamStatsComponent,
  RagnarNationComponent,
  TestimonialsComponent,
];

const ENTRY_COMPONENTS = [
  VirtualUpSellModalComponent,
  CommonModelDialogComponent,
  WaiverModalComponent,
  ImageCropComponent,
  AddLatestActivityComponent,
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    RouterModule,
    ...MODULES,
    SlickCarouselModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, 'http://localhost:4000/assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [
    ...COMPONENTS,
    FormControlComponent,
    InviteModalComponent,
    FaqModalComponent,
    RagnarNationComponent,
    BadgeAchievementModalComponent,
  ],
  exports: [...COMPONENTS],
  providers: [ToastService],
})
export class ComponentsModule {}
