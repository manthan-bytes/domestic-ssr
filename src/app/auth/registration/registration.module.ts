import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { ComponentsModule } from '@components/components.module';
import { RegistrationComponent } from './registration.component';
import { RegistrationRoutingModule } from './registration-routing.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { SelectPlanComponent } from './select-plan/select-plan.component';
import { PaymentComponent } from './payment/payment.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    RegistrationRoutingModule,
    CommonModule,
    FormsModule,
    CoreModule,
    ComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, `http://${environment.SERVER_URL}:${environment.SSR_PORT}/assets/i18n/`, '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [RegistrationComponent, PersonalInfoComponent, SelectPlanComponent, PaymentComponent],
})
export class RegistrationModule { }
