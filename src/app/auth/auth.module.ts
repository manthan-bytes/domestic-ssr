import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { ComponentsModule } from '@components/components.module';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegistrationModule } from './registration/registration.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastService } from '@components/toast/toast.service';
import { environment } from 'src/environments/environment';
@NgModule({
  imports: [
    AuthRoutingModule,
    CommonModule,
    FormsModule,
    CoreModule,
    ComponentsModule,
    RegistrationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, `http://${environment.SERVER_URL}:${environment.SSR_PORT}/assets/i18n/`, '.json'),
        deps: [HttpClient],
      },
    })
  ],
  declarations: [AuthComponent, LoginComponent, CreateAccountComponent, ForgotPasswordComponent, ResetPasswordComponent],
  providers: [ToastService],
})
export class AuthModule { }
