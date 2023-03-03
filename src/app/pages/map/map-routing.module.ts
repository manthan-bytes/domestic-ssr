import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    data: {
      title: 'Ragnar Map | Adventure Awaits',
      // tslint:disable-next-line: quotemark
      description: "Looking for an old favorite? In search of a new adventure? We've got a few to choose from.",
      keywords:
        'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapRoutingModule {}
