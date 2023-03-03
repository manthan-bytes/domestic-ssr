import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { staticRoutes, authRoutes } from '@core/utils/routes-path.constant.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/homev2/homev2.module').then((m) => m.Homev2Module),
  },
  {
    path: authRoutes.main,
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
