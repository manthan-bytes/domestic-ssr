import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-event-detail-get-ready',
  templateUrl: './get-ready.component.html',
  styleUrls: ['./get-ready.component.scss'],
})
export class GetReadyComponent implements OnInit {
  @Input() getReadyData: OverviewRaceData;
  constructor(private router: Router, private dataLayerService: DataLayerService) {}

  captainTool: boolean;
  planYourTrip: boolean;
  shopforgear: boolean;
  training: boolean;
  shopForGearLinks = [];
  trainingLinks = [];

  ngOnInit(): void {
    if (!this.getReadyData.captains_tools.some((tool) => tool.id === 20000)) {
      this.getReadyData.captains_tools.push({
        id: 20000,
        title: 'Custom Team Shirts',
        type: 'url',
        value: 'https://www.customink.com/ink/partners/ragnar-relay',
        value_type: 'url',
      });
    }
    if (!this.getReadyData.trips.some((tool) => tool.id === 20000)) {
      this.getReadyData.trips.push({
        id: 20000,
        race_id: 0,
        sort: 1,
        title: 'Find Your Local Fleet Feet',
        type: 'url',
        value: 'https://www.fleetfeet.com/locations?utm_source=ragnar&utm_medium=referral&utm_campaign=races_getready',
      });
    }

    this.shopForGearLinks.push(
      {
        sort: 1,
        title: 'Ragnar Gear',
        type: 'url',
        value: 'http://www.ragnargear.com/',
      },
      {
        sort: 2,
        title: 'Shop Fleet Feet',
        type: 'url',
        value: 'https://www.fleetfeet.com/browse?utm_source=ragnar&utm_medium=referral&utm_campaign=races_getready',
      },
      {
        sort: 3,
        title: 'Event Specific Finisher Items',
        type: 'url',
        value: 'https://stores.customink.com/ragnarfinisher',
      },
      {
        sort: 4,
        title: 'Custom Team Shirts',
        type: 'url',
        value: 'https://www.customink.com/ink/partners/ragnar-relay',
      },
    );
    if (this.getReadyData.type === 'trail') {
      this.trainingLinks.push(
        {
          sort: 1,
          title: 'Ragnar Training',
          type: 'url',
          value: 'https://www.runragnar.com/blog/home/trail-training-tips-with-ben-light/',
        },
        {
          sort: 2,
          title: 'Training Tips from Fleet Feet',
          type: 'url',
          value: 'https://www.fleetfeet.com/blog?utm_source=ragnar&utm_medium=referral&utm_campaign=races_getready',
        },
      );
    } else {
      this.trainingLinks.push(
        {
          sort: 1,
          title: 'Ragnar Training',
          type: 'url',
          value: '/training/road',
        },
        {
          sort: 2,
          title: 'Training Tips from Fleet Feet',
          type: 'url',
          value: 'https://www.fleetfeet.com/blog?utm_source=ragnar&utm_medium=referral&utm_campaign=races_getready',
        },
      );
    }
  }

  goToDetails(slug: string): void {
    this.router.navigate(['/partner', slug]);
  }
}
