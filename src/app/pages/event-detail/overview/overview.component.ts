import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import { EventService } from '@core/utils/event/event.service';
import { DataLayerService } from '@core/utils';
@Component({
  selector: 'app-event-detail-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() overviewData: OverviewRaceData;
  @Input() pricingStages;
  public statusMsg: string;
  constructor(public eventService: EventService, private dataLayerService: DataLayerService) {}
   
  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'event-detail-overview',
      pagePostType: 'eventDetailOverview',
      pagePostType2: 'single-page',
    });
    this.getRaceData();
  }
  addPageInitEvent(screen_name) {
    const pagePostType = screen_name.replace(/(^|-)./g, (s) => s.slice(-1).toUpperCase());
    this.dataLayerService.pageInitEvent({
      screen_name,
      pagePostType,
      pagePostType2: 'single-page',
    });
  }
  getRaceData() {
    if (this.overviewData) {
      if (this.overviewData.files.banner.split(' ').length > 1) {
        this.overviewData.files.banner = this.overviewData.files.banner.split(' ').join('%20');
      }

      this.statusMsg = this.eventService.getStatusMsg(this.overviewData);
    }
  }
}
