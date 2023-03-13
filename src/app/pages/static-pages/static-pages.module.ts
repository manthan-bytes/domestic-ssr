import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaticPagesComponent } from './static-pages.component';
import { StaticPagesRoutingModule } from './static-pages-routing.module';
import { InnovationLabComponent } from './innovation-lab/innovation-lab.component';
import { GlampingComponent } from './glamping/glamping.component';
import { WhatIsRagnarComponent } from './what-is-ragnar/what-is-ragnar.component';
import { DivisionClassificationComponent } from './division-classification/division-classification.component';
import { MedalsComponent } from './medals/medals.component';
import { SafetyComponent } from './safety/safety.component';
import { VolunteerComponent } from './volunteer/volunteer.component';
import { OurStoryComponent } from './our-story/our-story.component';
import { MeetupComponent } from './meetup/meetup.component';
import { AmbassadorComponent } from './ambassador/ambassador.component';
import { RoadPartnerComponent } from './road-partner/road-partner.component';
import { TrailPartnerComponent } from './trail-partner/trail-partner.component';
import { SustainabilityComponent } from './sustainability/sustainability.component';
import { LoveTheLocalsComponent } from './love-the-locals/love-the-locals.component';
import { RoadComponent } from './what-is-ragnar/road/road.component';
import { TrailComponent } from './what-is-ragnar/trail/trail.component';
import { SunsetComponent } from './what-is-ragnar/sunset/sunset.component';
import { BlackloopComponent } from './what-is-ragnar/blackloop/blackloop.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PurchasePolicyComponent } from './purchase-policy/purchase-policy.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { VolunteerContactComponent } from './volunteer/volunteer-contact/volunteer-contact.component';
import { AmbassadorFormComponent } from './ambassador/ambassador-form/ambassador-form.component';
import { HomeComponent } from './home/home.component';
import { CoreModule } from '@core/core.module';
import { TrainingRoadComponent } from './training-road/training-road.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PlanYourTripComponent } from './plan-your-trip/plan-your-trip.component';
// import { Homev2Module } from './homev2/homev2.module';
import { PartnersComponent } from './partners/partners.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PartnerDetailsComponent } from './partners/partner-details/partner-details.component';
import { ComponentsModule } from '@components/components.module';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    StaticPagesComponent,
    InnovationLabComponent,
    GlampingComponent,
    WhatIsRagnarComponent,
    DivisionClassificationComponent,
    MedalsComponent,
    SafetyComponent,
    VolunteerComponent,
    OurStoryComponent,
    MeetupComponent,
    AmbassadorComponent,
    RoadPartnerComponent,
    TrailPartnerComponent,
    SustainabilityComponent,
    LoveTheLocalsComponent,
    RoadComponent,
    TrailComponent,
    SunsetComponent,
    BlackloopComponent,
    PrivacyPolicyComponent,
    TermsOfUseComponent,
    PurchasePolicyComponent,
    VolunteerContactComponent,
    AmbassadorFormComponent,
    HomeComponent,
    TrainingRoadComponent,
    PlanYourTripComponent,
    PartnersComponent,
    PartnerDetailsComponent,
  ],
  imports: [
    StaticPagesRoutingModule,
    CommonModule,
    ComponentsModule,
    NgbModule,
    FormsModule,
    CoreModule,
    SlickCarouselModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, `http://${environment.SERVER_URL}:${environment.SSR_PORT}/assets/i18n/`, '.json'),
        deps: [HttpClient],
      },
    }),
    // SlickCarouselModule,
  ],
})
export class StaticPagesModule { }
