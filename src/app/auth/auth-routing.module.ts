import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { authRoutes, registrationRoutes } from '@core/utils';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthenticationGuard } from '@core/guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: registrationRoutes.main,
        canActivate: [AuthenticationGuard],
        loadChildren: () => import('./registration/registration.module').then((m) => m.RegistrationModule),
      },
      {
        path: authRoutes.login,
        component: LoginComponent,
        data: {
          title: 'Ragnar Account Login | Thanks for using a secure password!',
          description: 'Ragnar Account Login',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: authRoutes.createAccount,
        component: CreateAccountComponent,
        data: {
          title: 'Ragnar Account Creation | Welcome to the cool club!',
          description: 'Just created your Ragnar account? Nice. Virtual High Five!',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: authRoutes.forgotPassword,
        component: ForgotPasswordComponent,
        data: {
          title: 'Ragnar Forgot Password | No sweat, happens to the best of us. ',
          description: 'Ragnar Password Reset',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: `${authRoutes.resetPassword}/:email/:verificationCode`,
        component: ResetPasswordComponent,
        data: {
          title: 'Ragnar Reset Password' /* TODO: Remaning */,
          description: 'Ragnar has overnight relay races in 25+ states across the nation. Find a race near you on our race calendar.',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: '',
        redirectTo: authRoutes.login,
        pathMatch: 'full',
        data: {
          title: 'Ragnar Account Login | Thanks for using a secure password!' /* TODO: Remaning */,
          description: 'Ragnar Account Login',
          keywords:
            'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
        },
      },
      {
        path: '**',
        component: LoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
