import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { DataLayerService } from '@core/utils';
import { headerRoutes } from '@core/utils/routes-path.constant.service';
@Component({
  selector: 'app-training-road',
  templateUrl: './training-road.component.html',
  styleUrls: ['./training-road.component.scss'],
})
export class TrainingRoadComponent implements OnInit {
  public headerRoutes = headerRoutes;
  constructor(private dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}
  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'training-road',
      pagePostType: 'trainingRoad',
      pagePostType2: 'single-page',
    });
    this.newVisitorService.popUp();
  }
}
