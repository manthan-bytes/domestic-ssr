import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeV2Route, StaticPageRoutes, staticRoutes, TeamCenterRoutes,eventDetailRoutes, MapRoute, virtualChallengeRoutes } from '../@core/utils/routes-path.constant.service';
import { PageNotFoundComponent } from '../@components/page-not-found/page-not-found.component';
import { AuthenticationGuard } from '@core/guards/authentication.guard';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: HomeV2Route.main,
        loadChildren: () => import('./homev2/homev2.module').then((m) => m.Homev2Module),
      },
      {
        path: virtualChallengeRoutes.main,
        loadChildren: () => import('./virtual-challenge/virtual-challenge.module').then((m) => m.VirtualChallengeModule),
      },
      {
        path: eventDetailRoutes.main,
        loadChildren: () => import('./event-detail/event-detail.module').then((m) => m.EventDetailModule),
      },
      {
        path: MapRoute.map,
        loadChildren: () => import('./map/map.module').then((m) => m.MapModule),
      },
      {
        path: StaticPageRoutes.main,
        loadChildren: () => import('./static-pages/static-pages.module').then((m) => m.StaticPagesModule),
      },
      {
        path: TeamCenterRoutes.main,
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('./team-center/team-center.module').then((m) => m.TeamCenterModule),
      },
      {
        path: StaticPageRoutes.welcome,
        loadChildren: () => import('./welcome/welcome.module').then((m) => m.WelcomeModule),
      },
      {
        path: staticRoutes.pageNotFound,
        component: PageNotFoundComponent,
        data: {
          title: 'Ragnar Not Found' /* TODO: Remaning */,
          description: 'Not able to find the content you are looking for',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: '',
        redirectTo: StaticPageRoutes.main,
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: staticRoutes.pageNotFound,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
