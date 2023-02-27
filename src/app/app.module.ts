import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ComponentsModule } from './@components/components.module';
import { TransferStateInterceptor } from '@core/interceptors/transfer-state.interceptor';
import { VirtualChallengeSharedDataService } from './@core/utils/virtual-challenge-shared-data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    ComponentsModule,
    NgbModule,
    HttpClientModule,
    PagesModule
  ],
  providers: [
    // {provide : LocationStrategy , useClass: HashLocationStrategy},
    { provide: APP_BASE_HREF, useValue: environment.BASE_URL || '' },
    VirtualChallengeSharedDataService,
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TransferStateInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
