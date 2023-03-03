import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NewVisitorService } from '@core/data';
import { RagnarCMSDataService } from '@core/data/race/ragnar-cms.service';
import { planYourTrip } from '@core/graphql/graphql';
import { DataLayerService } from '@core/utils';
@Component({
  selector: 'app-plan-your-trip',
  templateUrl: './plan-your-trip.component.html',
  styleUrls: ['./plan-your-trip.component.scss'],
})
export class PlanYourTripComponent implements OnInit {
  public event;
  constructor(
    private route: ActivatedRoute,
    private ragnarCMSDataService: RagnarCMSDataService,
    private dataLayerService: DataLayerService,
    private newVisitorService: NewVisitorService,
  ) {}

  ngOnInit(): void {
    this.newVisitorService.popUp();
    this.dataLayerService.pageInitEvent({
      screen_name: 'plan-your-trip',
      pagePostType: 'planYourTrip',
      pagePostType2: 'single-page',
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('eventId')) {
        this.ragnarCMSDataService.getPlanYourTripDataWithGql(params.get('eventId'), planYourTrip).subscribe(
          (response) => {
            this.event = response;
          },
          (error) => {
            console.error(error);
          },
        );
      }
    });
  }

  sortBy(prop: string) {
    return this.event.travel.sort((a, b) => (a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1));
  }
}
