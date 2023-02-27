import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Homev2Component } from './homev2.component';

const routes: Routes = [
  {
    path: '',
    component: Homev2Component,
    data: {
      title: 'Ragnar Home | Find an Overnight Road or Trail Running Relay Near You!',
      description:
        'What is Ragnar? Long distance, team, overnight running relays races in scenic locations across the country. If you can run a 10k or a half marathon, you can run a Ragnar Relay! Register today.',
      keywords:
        'Ragnar, overnight relay race, half marathon, 10k, trail running, team relay, race calendar, run a race, find a race, long distance running',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Homev2RoutingModule {}
