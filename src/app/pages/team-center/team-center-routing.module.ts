import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamCenterComponent } from './team-center.component';

const routes: Routes = [
  {
    path: '',
    component: TeamCenterComponent,
    data: {
      title: 'Ragnar Team Center | Your Command Center',
      description: 'Ready, Set, Ragnar...',
      keywords:
        'race calendar, running events, overnight relay race, find a race, run a race, 10k, half marathon, Ragnar Relay, Ragnar Trail',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamCenterRoutingModule {}
