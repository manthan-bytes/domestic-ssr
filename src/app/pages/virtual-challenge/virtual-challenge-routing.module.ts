import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { virtualChallengeRoutes } from '@core/utils/routes-path.constant.service';
import { VirtualChallengeComponent } from './virtual-challenge.component';
import { HomeComponent } from './home/home.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { InfoComponent } from './info/info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PublicShareComponent } from './public-share/public-share.component';
import { AuthenticationGuard } from '@core/guards/authentication.guard';
import { ChooseTeamComponent } from './choose-team/choose-team.component';
import { DcDashboardComponent } from './dc-dashboard/dc-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: VirtualChallengeComponent,
    children: [
      {
        path: virtualChallengeRoutes.home,
        component: HomeComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual Challenge',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: virtualChallengeRoutes.howItWorks,
        component: HowItWorksComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual Challenge | How it Works',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: virtualChallengeRoutes.info,
        component: InfoComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual Challenge | Info',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: virtualChallengeRoutes.dashboard,
        canActivate: [AuthenticationGuard],
        component: DashboardComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual | Dashboard',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: virtualChallengeRoutes.userProfile,
        canActivate: [AuthenticationGuard],
        component: UserProfileComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual | User Profile',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: `${virtualChallengeRoutes.publicShare}/:id`,
        component: PublicShareComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual | Public Profile',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: `${virtualChallengeRoutes.chooseTeam}/:id`,
        canActivate: [AuthenticationGuard],
        component: ChooseTeamComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual | Choose Team',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
      {
        path: '',
        redirectTo: virtualChallengeRoutes.info,
        pathMatch: 'full',
      },
      {
        path: virtualChallengeRoutes.DcDashboard,
        canActivate: [AuthenticationGuard],
        component: DcDashboardComponent,
        data: {
          /* TODO: Remaning */ title: 'Ragnar | Virtual | 31 Days Dashboard',
          description:
            'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
          keywords:
            'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VirtualChallengeRoutingModule {}
