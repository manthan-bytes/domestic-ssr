import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { HomeV2Route, StaticPageRoutes, staticRoutes, eventDetailRoutes } from '../@core/utils/routes-path.constant.service';
import { PageNotFoundComponent } from '../@components/page-not-found/page-not-found.component';


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
        path: eventDetailRoutes.main,
        loadChildren: () => import('./event-detail/event-detail.module').then((m) => m.EventDetailModule),
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
export class PagesRoutingModule {}
