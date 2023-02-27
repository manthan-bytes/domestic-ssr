import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EventDetailComponent } from './event-detail.component';

const routes: Routes = [
  {
    path: ':eventType/:eventId',
    component: EventDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventDetailRoutingModule {}
