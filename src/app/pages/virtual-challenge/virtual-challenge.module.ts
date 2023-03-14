import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { VirtualChallengeComponent } from './virtual-challenge.component';
import { VirtualChallengeRoutingModule } from './virtual-challenge-routing.module';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { InfoComponent } from './info/info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '@components/components.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { ThemeModule } from '@core/theme/theme.module';
import { lightTheme, darkTheme } from '@core/theme/utils';
import { PublicShareComponent } from './public-share/public-share.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChooseTeamComponent } from './choose-team/choose-team.component';
import { DcDashboardComponent } from './dc-dashboard/dc-dashboard.component';
import { environment } from 'src/environments/environment';


const COMPONENTS = [
  HomeComponent,
  VirtualChallengeComponent,
  HowItWorksComponent,
  InfoComponent,
  DashboardComponent,
  UserProfileComponent,
  PublicShareComponent,
  ChooseTeamComponent,
];

@NgModule({
  declarations: [...COMPONENTS, DcDashboardComponent],
  imports: [
    VirtualChallengeRoutingModule,
    CommonModule,
    NgbModule,
    ComponentsModule,
    FormsModule,
    CoreModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'light',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, `http://${environment.SERVER_URL}:${environment.SSR_PORT}/assets/i18n/`, '.json'),
        deps: [HttpClient],
      },
    }),
  ],
})
export class VirtualChallengeModule {}
