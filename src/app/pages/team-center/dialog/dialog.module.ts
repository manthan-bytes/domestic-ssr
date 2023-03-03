import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@core/core.module';
import { FormsModule } from '@angular/forms';
import { RunnerVolunteerInviteComponent } from './runner-volunteer-invite/runner-volunteer-invite.component';
import { InvitationListComponent } from './invitation-list/invitation-list.component';
import { RunnerVolunteerDeleteComponent } from './runner-volunteer-delete/runner-volunteer-delete.component';
import { TeamVolunteerFeesComponent } from './team-volunteer-fees/team-volunteer-fees.component';
import { GlummpingFeesComponent } from './glummping-fees/glummping-fees.component';
import { DigitalCheckInComponent } from './digital-check-in/digital-check-in.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RosterSubstritutionComponent } from './roster-substritution/roster-substritution.component';

const COMPONENTS = [
  RunnerVolunteerInviteComponent,
  InvitationListComponent,
  RunnerVolunteerDeleteComponent,
  TeamVolunteerFeesComponent,
  DigitalCheckInComponent,
  RosterSubstritutionComponent,
  GlummpingFeesComponent,
];

const ENTRY_COMPONENTS = [
  RunnerVolunteerInviteComponent,
  RunnerVolunteerDeleteComponent,
  TeamVolunteerFeesComponent,
  GlummpingFeesComponent,
  DigitalCheckInComponent,
  RosterSubstritutionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class DialogModule {}
