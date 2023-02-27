import { Component, Input } from '@angular/core';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import { EventService } from '@core/utils/event/event.service';
@Component({
  selector: 'app-event-detail-charities',
  templateUrl: './charities.component.html',
  styleUrls: ['./charities.component.scss'],
})
export class CharitiesComponent {
  @Input() charitiesData: OverviewRaceData;
  constructor(public eventService: EventService) {}
}
