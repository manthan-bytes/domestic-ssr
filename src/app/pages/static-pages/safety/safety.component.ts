import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { DataLayerService } from '@core/utils';
import { headerRoutes } from '@core/utils/routes-path.constant.service';
@Component({
  selector: 'app-safety',
  templateUrl: './safety.component.html',
  styleUrls: ['./safety.component.scss'],
})
export class SafetyComponent implements OnInit {
  public headerRoutes = headerRoutes;
  constructor(private dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}
  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'safety',
      pagePostType: 'safety',
      pagePostType2: 'single-page',
    });
    this.newVisitorService.popUp();
  }
}
