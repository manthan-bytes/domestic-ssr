import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { registrationRoutes } from '@core/utils';
import { RegistrationComponent } from './registration.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { PaymentComponent } from './payment/payment.component';
const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    children: [
      {
        path: `${registrationRoutes.virtualChallenge}/:id/${registrationRoutes.selectPlan}`,
        component: SelectPlanComponent,
        data: {
          title: 'Ragnar Select Plan' /* TODO: Remaning */,
          description: 'Ragnar has overnight relay races in 25+ states across the nation. Find a race near you on our race calendar.',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: `${registrationRoutes.virtualChallenge}/:id/${registrationRoutes.personalInfo}`,
        component: PersonalInfoComponent,
        data: {
          title: 'Ragnar Personal Info' /* TODO: Remaning */,
          description: 'Ragnar has overnight relay races in 25+ states across the nation. Find a race near you on our race calendar.',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: `${registrationRoutes.virtualChallenge}/:id/${registrationRoutes.payment}`,
        component: PaymentComponent,
        data: {
          title: 'Ragnar Payment' /* TODO: Remaning */,
          description: 'Ragnar has overnight relay races in 25+ states across the nation. Find a race near you on our race calendar.',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: '',
        redirectTo: registrationRoutes.virtualChallenge,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
