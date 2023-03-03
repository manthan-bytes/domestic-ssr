import { Component, Input, OnInit } from '@angular/core';
import replace from 'lodash/replace';
import { EventData } from '@core/interfaces/team-center.interface';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-team-center-race-updates',
  templateUrl: './race-updates.component.html',
  styleUrls: ['./race-updates.component.scss'],
})
export class RaceUpdatesComponent {
  @Input() eventData: EventData;

  constructor(private dataLayerService: DataLayerService) {}

  getUpdate(update) {
    if (update) {
      update = replace(update, new RegExp('target="_blank"', 'g'), '');
      update = replace(update, new RegExp('<a ', 'g'), '<a target="_blank" ');
    }
    return update;
  }
}
