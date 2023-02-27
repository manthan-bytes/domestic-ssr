import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '../@components/components.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
// import { VirtualChallengeModule } from './virtual-challenge/virtual-challenge.module';
// import { EventDetailModule } from './event-detail/event-detail.module';
// import { MapModule } from './map/map.module';
// import { StaticPagesModule } from './static-pages/static-pages.module';
// import {Homev2Module} from './homev2/homev2.module'

@NgModule({
  declarations: [PagesComponent],
  imports: [PagesRoutingModule, CommonModule, /*StaticPagesModule,*/ ComponentsModule],
})
export class PagesModule {}
