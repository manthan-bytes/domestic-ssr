import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaticPageRoutes } from '@core/utils';
import { AmbassadorComponent } from './ambassador/ambassador.component';
import { DivisionClassificationComponent } from './division-classification/division-classification.component';
import { GlampingComponent } from './glamping/glamping.component';
import { InnovationLabComponent } from './innovation-lab/innovation-lab.component';
import { LoveTheLocalsComponent } from './love-the-locals/love-the-locals.component';
import { MedalsComponent } from './medals/medals.component';
import { MeetupComponent } from './meetup/meetup.component';
import { OurStoryComponent } from './our-story/our-story.component';
import { RoadPartnerComponent } from './road-partner/road-partner.component';
import { SafetyComponent } from './safety/safety.component';
import { StaticPagesComponent } from './static-pages.component';
import { SustainabilityComponent } from './sustainability/sustainability.component';
import { TrailPartnerComponent } from './trail-partner/trail-partner.component';
import { VolunteerComponent } from './volunteer/volunteer.component';
import { WhatIsRagnarComponent } from './what-is-ragnar/what-is-ragnar.component';
import { RoadComponent } from './what-is-ragnar/road/road.component';
import { TrailComponent } from './what-is-ragnar/trail/trail.component';
import { SunsetComponent } from './what-is-ragnar/sunset/sunset.component';
import { BlackloopComponent } from './what-is-ragnar/blackloop/blackloop.component';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PurchasePolicyComponent } from './purchase-policy/purchase-policy.component';
import { VolunteerContactComponent } from './volunteer/volunteer-contact/volunteer-contact.component';
import { AmbassadorFormComponent } from './ambassador/ambassador-form/ambassador-form.component';
import { TrainingRoadComponent } from './training-road/training-road.component';
import { environment } from '../../../environments/environment';
import { PlanYourTripComponent } from './plan-your-trip/plan-your-trip.component';
// import { Homev2Component } from './homev2/homev2.component';
// import { WelcomeComponent } from '../welcome/welcome.component';
import { PartnersComponent } from './partners/partners.component';
import { PartnerDetailsComponent } from './partners/partner-details/partner-details.component';
const routes: Routes = [
  {
    path: StaticPageRoutes.main,
    component: StaticPagesComponent,
    children: [
      // {
      //   path: StaticPageRoutes.main,
      //   component: Homev2Component,
      //   data: {
      //     title: 'Ragnar Home | Find an Overnight Road or Trail Running Relay Near You!',
      //     description:
      //       'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
      //     keywords:
      //       'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
      //   },
      // },
      {
        path: StaticPageRoutes.innovationLab,
        component: InnovationLabComponent,
        data: {
          title: 'Ragnar Innovation Lab | Guinea Pigs Needed!',
          description: 'Learn about new ideas in the pipeline.',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: StaticPageRoutes.glamping,
        component: GlampingComponent,
        data: {
          title: 'Ragnar Glamping | Put your feet up!',
          description: 'Elevate your Ragnar Trail experience to 11!',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: StaticPageRoutes.ambassadors,
        component: AmbassadorComponent,
        data: {
          title: 'Become an Ambassador | Spread the Ragnar Love',
          description:
            'Turn your love of Ragnar into an official position. As an ambassador, you will be the face of Ragnar in your running community and receive some pretty sweet privileges in return.',
          keywords:
            'Ragnar Ambassador, run a race, Reebok Ragnar Relay, Ragnar Trail, running calendar, find a race, running relay, overnight relay race, relay race, half marathon',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/ambassadors.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/ambassadors.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.divisionsAndClassifications,
        component: DivisionClassificationComponent,
        data: {
          title: 'Ragnar Divsions & Classifications',
          description: 'A team assemble!',
          keywords:
            'long distance running, ultra running, trail running, relay race, run a race, competitive racing, race divisions, race classifications',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/form-a-team.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/form-a-team.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.loveTheLocals,
        component: LoveTheLocalsComponent,
        data: {
          title: 'Ragnar Love the Locals | Remember the Golden Rule!',
          description: 'Without our commununities we have no where to run. Please remember to be kind!',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: StaticPageRoutes.medals,
        component: MedalsComponent,
        data: {
          title: 'Ragnar Medals | Best Darn Race Medals in the World',
          description:
            'Celebrate your accomplishment with a one of a kind Ragnar race medal or go big and earn a Double Medal by running two distance races in a single year. Browse the bling here.',
          keywords:
            'race medal, double medal, ragnar medals, ragnar multitool medal, overnight relay race, run a race, find a race, race calendar, saints and sinners',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/double-medals.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/double-medals.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.meetupCalendar,
        component: MeetupComponent,
        data: {
          title: 'Ragnar Meetup Event Calendar | Calling all Ragnarians!',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: StaticPageRoutes.companyHistory,
        component: OurStoryComponent,
        data: {
          title: 'Ragnar History | The Idea Behind a Movement',
          description:
            'Steve Hill s dream to execute a 24+ hour running relay in the Utah mountains became a reality in 2004 with the Wasatch Back Relay. Ragnar has since grown into the largest overnight relay series in the nation.',
          keywords:
            'Ragnar Relay, Wasatch Back, overnight relay race, trail running, long distance running, half marathon, 10k, Ragnar Trail',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/history.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/history.jpg`,
          },
        },
      },
      // {
      //   path: StaticPageRoutes.roadPartners,
      //   component: RoadPartnerComponent,
      //   data: {
      //     /* TODO: Remaning */ title: 'Road Partners',
      //     description:
      //       'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
      //     keywords:
      //       'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
      //   },
      // },
      {
        path: StaticPageRoutes.safetyRoad,
        component: SafetyComponent,
        data: {
          title: 'Ragnar Safety Guidelines | Run Safe and Have Fun!',
          description:
            'Race safety is our first priority at Ragnar. Read through the safety rules for running long distances on our road and trail race courses.',
          keywords:
            'running safety, race safety, safety tips for runners, running in the heat, night running, team relay races, run a race, long distance running, race training',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/safety.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/safety.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.safety,
        component: SafetyComponent,
        data: {
          title: 'Ragnar Safety Guidelines | Run Safe and Have Fun!',
          description:
            'Race safety is our first priority at Ragnar. Read through the safety rules for running long distances on our road and trail race courses.',
          keywords:
            'running safety, race safety, safety tips for runners, running in the heat, night running, team relay races, run a race, long distance running, race training',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/safety.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/safety.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.sustainability,
        component: SustainabilityComponent,
        data: {
          title: 'Sustainability | Ragnar s Commitment to the Environment',
          description:
            'Ragnar is a socially and environmentally responsible company with a focus on sustainability at all of our running events.',
          keywords:
            // tslint:disable-next-line: max-line-length
            'Ragnar sustainability, Reebok Ragnar Relay, Ragnar Trail, trail running, 10k, half marathon, find a race, overnight relay race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/sustainability.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/sustainability.jpg`,
          },
        },
      },
      // {
      //   path: StaticPageRoutes.trailPartners,
      //   component: TrailPartnerComponent,
      //   data: {
      //     /* TODO: Remaning */ title: 'Trail Partners',
      //     description:
      //       'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
      //     keywords:
      //       'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
      //   },
      // },
      {
        path: StaticPageRoutes.runnerRequiredVolunteer,
        component: VolunteerComponent,
        data: {
          title: 'Volunteer at a Ragnar | What to Expect When You Volunteer',
          description:
            'We <3 Ragnar volunteers. Volunteers stoke the runners fire and make Ragnar 2-day trail races and 200-mile road races a reality. Interested in volunteering? Learn more here.',
          keywords:
            'race volunteer, run a race, volunteer at a race, overnight team relay, running relay, running calendar, team relay race, trail running, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/volunteer.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/volunteer.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.whatIsRagnar,
        component: WhatIsRagnarComponent,
        data: {
          title: 'What is Ragnar? Overnight, Team Relay Races on Trails and Roads',
          description:
            'Set a crazy goal. Gather your tribe. Divide and conquer. Bask in the joy of achieving something together that you could never do alone. With more cowbell, baby. Always more cowbell.',
          keywords:
            'Reebok Ragnar Relay, Ragnar Trail, half marathon, 10k, trail running, road running, overnight team relay, run a race, race calendar, ultra race, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/ragnar2/2019/what-is-ragnar-banner.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/ragnar2/2019/what-is-ragnar-banner.jpg`,
          },
        },
      },
      {
        path: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarRoad}`,
        component: RoadComponent,
        data: {
          title: 'Ragnar Road : Relay adventure meets epic road trip.',
          description:
            'Teams of 12 run roughly 200 miles—from point A to point B—on city streets, country roads, sidewalks, and bike paths. You’ll run day, and night, and day again, sleeping (ha ha) in vans, grassy fields, or perhaps a high school gym (with the principal’s permission).',
          keywords:
            'Reebok Ragnar Relay, Ragnar Trail, half marathon, 10k, trail running, road running, overnight team relay, run a race, race calendar, ultra race, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/discover-road.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/discover-road.jpg`,
          },
        },
      },
      {
        path: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarTrail}`,
        component: TrailComponent,
        data: {
          title: 'Ragnar Trail : Like summer camp for adults — with trail running and race medals.',
          description:
            'Teams of 8 run roughly 120 miles—in three repeating loops—on wilderness trails that wind through forests, valleys, and mountainsides. You’ll run day, and night, and day again, sleeping (yeah right) in a temporary tent city known as Ragnar Village.',
          keywords:
            'Reebok Ragnar Relay, Ragnar Trail, half marathon, 10k, trail running, road running, overnight team relay, run a race, race calendar, ultra race, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/discover-trail.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/discover-trail.jpg`,
          },
        },
      },
      {
        path: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarSunset}`,
        component: SunsetComponent,
        data: {
          title: 'Ragnar Sunset : Race to the finish before the sun goes down.',
          description:
            'Teams of 4 run 26-ish miles in one evening—one runner at a time on a single loop—hoping to cross the finish line before the sun sets, where an epic party awaits. We basically took a marathon, turned it into a team sport, and added live music and food trucks.',
          keywords:
            'Reebok Ragnar Relay, Ragnar Trail, half marathon, 10k, trail running, road running, overnight team relay, run a race, race calendar, ultra race, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/discover-sunset.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/discover-sunset.jpg`,
          },
        },
      },
      {
        path: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarBlackloop}`,
        component: BlackloopComponent,
        data: {
          title: 'Black Loop : Take your Ragnar Trail experience to the next level. Are you badass enough?',
          description:
            'The Ragnar Black Loop is a team type available at select Ragnar Trail races. Instead of teams of 8 running relay-style, just you and a teammate will run the green, yellow and red loops together on day one. Beginning early on day 2, you will conquer the Black Loop. Team start times will be based on your aggregate times from the day before with the fastest team starting first. The first team to cross the finish line wins overall!',
          keywords:
            'Reebok Ragnar Relay, Ragnar Trail, half marathon, 10k, trail running, road running, overnight team relay, run a race, race calendar, ultra race, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/blackloop/blackloop-banner.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/what-is-ragnar/blackloop/blackloop-banner.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.termsOfUse,
        component: TermsOfUseComponent,
        data: {
          title: 'Ragnar Terms of Use | Fun Legal Stuff!',
          description: 'It is important though. ',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: StaticPageRoutes.privacyPolicy,
        component: PrivacyPolicyComponent,
        data: {
          title: 'Ragnar Privacy Policy | We respect your data.  ',
          // tslint:disable-next-line: quotemark
          description: "We don't do shady things with your data. ",
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: StaticPageRoutes.planYourTrip + '/:eventType/:eventId',
        component: PlanYourTripComponent,
        data: {
          title: 'Plan your trip',
          description: 'Plan your trip',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: StaticPageRoutes.purchasePolicy,
        component: PurchasePolicyComponent,
        data: {
          title: 'Ragnar Purchase Policy | That Financial Fine Print!',
          description: 'Ironically, in larger print. Transparency! ',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      // {
      //   path: StaticPageRoutes.volunteerContact,
      //   component: VolunteerContactComponent,
      //   data: {
      //     title: 'Volunteer at a Ragnar | What to Expect When You Volunteer',
      //     description:
      //       'We <3 Ragnar volunteers. Volunteers stoke the runners fire and make Ragnar 2-day trail races and 200-mile road races a reality. Interested in volunteering? Learn more here.',
      //     keywords:
      //       'race volunteer, run a race, volunteer at a race, overnight team relay, running relay, running calendar, team relay race, trail running, trail race',
      //     properties: {
      //       ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/volunteer.jpg`,
      //       ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/volunteer.jpg`,
      //     },
      //   },
      // },
      {
        path: `${StaticPageRoutes.ambassadors}/${StaticPageRoutes.ambassadorsForm}`,
        component: AmbassadorFormComponent,
        data: {
          title: 'Become an Ambassador | Spread the Ragnar Love',
          description:
            'We <3 Ragnar volunteers. Volunteers stoke the runners fire and make Ragnar 2-day trail races and 200-mile road races a reality. Interested in volunteering? Learn more here.',
          keywords:
            'race volunteer, run a race, volunteer at a race, overnight team relay, running relay, running calendar, team relay race, trail running, trail race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/volunteer.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/volunteer.jpg`,
          },
        },
      },
      {
        path: StaticPageRoutes.trainingRoad,
        component: TrainingRoadComponent,
        data: {
          title: 'Train for Your Ragnar Relay | Workouts and Training Plans',
          description:
            'Training for a Reebok Ragnar Relay is similar to training for a 10k or half marathon. Download a Ragnar training guide to get started!',
          keywords:
            'race training guide, train for a Ragnar, train for a marathon, 10k training, half marathon training, race training, trail for a distance race, overnight relay race',
          properties: {
            ogImage: `${environment.DOMESTIC_URL}/images/static-pages/banners/training.jpg`,
            ogImageUrl: `${environment.DOMESTIC_URL}/images/static-pages/banners/training.jpg`,
          },
        },
      },
      // {
      //   path: StaticPageRoutes.welcome,
      //   component: WelcomeComponent,
      //   data: {
      //     title: 'Welcome',
      //     description: 'Welcome',
      //     keywords:
      //       'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
      //   },
      // },
      {
        path: '',
        redirectTo: StaticPageRoutes.main,
        pathMatch: 'full',
      },
      {
        path: StaticPageRoutes.partners,
        component: PartnersComponent,
        data: {
          title: 'Ragnar Partners',
          description: 'Ragnar Partners',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: `${StaticPageRoutes.partner}/:slug`,
        component: PartnerDetailsComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaticPagesRoutingModule {}
