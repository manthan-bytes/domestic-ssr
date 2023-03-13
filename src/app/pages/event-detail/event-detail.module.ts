import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDetailComponent } from './event-detail.component';
import { EventDetailRoutingModule } from './event-detail-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { RegistrationComponent } from './registration/registration.component';
import { DatesAndUpdatesComponent } from './dates-and-updates/dates-and-updates.component';
import { GetReadyComponent } from './get-ready/get-ready.component';
import { CharitiesComponent } from './charities/charities.component';
import { ResultsPhotosComponent } from './results-photos/results-photos.component';
import { CourseComponent } from './course/course.component';
import { CoreModule } from '@core/core.module';
import { CourseMapComponent } from './course/course-map/course-map.component';
import { NgDygraphsModule } from 'ng-dygraphs';
import { CourseElevationComponent } from './course/course-elevation/course-elevation.component';
import { CourseTableComponent } from './course/course-table/course-table.component';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SelectedLegDetailsComponent } from './dialog/selected-leg-details/selected-leg-details.component';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    EventDetailComponent,
    OverviewComponent,
    RegistrationComponent,
    DatesAndUpdatesComponent,
    GetReadyComponent,
    CharitiesComponent,
    ResultsPhotosComponent,
    CourseComponent,
    CourseMapComponent,
    CourseElevationComponent,
    CourseTableComponent,
    SelectedLegDetailsComponent,
  ],
  imports: [
    CommonModule,
    EventDetailRoutingModule,
    CoreModule,
    NgDygraphsModule,
    NgbModule,
    NgbNavModule,
    // GoogleChartsModule
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, `http://${environment.SERVER_URL}:${environment.SSR_PORT}/assets/i18n/`, '.json'),
        deps: [HttpClient],
      },
    }),
  ],
})
export class EventDetailModule {}
