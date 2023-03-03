import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamCenterComponent } from './team-center.component';
import { TeamDetailsComponent } from './tabs/team-details/team-details.component';
import { RosterComponent } from './tabs/roster/roster.component';
import { RunnerAssignmentsComponent } from './tabs/runner-assignments/runner-assignments.component';
import { VolunteersComponent } from './tabs/volunteers/volunteers.component';
import { RaceUpdatesComponent } from './tabs/race-updates/race-updates.component';
import { CovidCheckInComponent } from './tabs/covid-check-in/covid-check-in.component';
import { TeamCenterRoutingModule } from './team-center-routing.module';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '@core/core.module';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/components.module';
import { DialogModule } from './dialog/dialog.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CheckInComponent } from './tabs/deprecated check-in/check-in.component';

const COMPONENTS = [
  TeamCenterComponent,
  TeamDetailsComponent,
  RosterComponent,
  RunnerAssignmentsComponent,
  VolunteersComponent,
  RaceUpdatesComponent,
  CheckInComponent,
  CovidCheckInComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    TeamCenterRoutingModule,
    NgbModule,
    NgbNavModule,
    CoreModule,
    FormsModule,
    ComponentsModule,
    DialogModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
})
export class TeamCenterModule {}
