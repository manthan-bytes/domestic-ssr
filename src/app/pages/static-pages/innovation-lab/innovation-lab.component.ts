import { Component, OnInit } from '@angular/core';
import { headerRoutes } from '@core/utils/routes-path.constant.service';
import { DataLayerService } from '@core/utils';
import { NewVisitorService } from '@core/data';
@Component({
  selector: 'app-innovation-lab',
  templateUrl: './innovation-lab.component.html',
  styleUrls: ['./innovation-lab.component.scss'],
})
export class InnovationLabComponent implements OnInit {
  public headerRoutes = headerRoutes;
  constructor(private dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}
  ngOnInit(): void {
    this.newVisitorService.popUp();
    this.dataLayerService.pageInitEvent({
      screen_name: 'innovation-lab',
      pagePostType: 'innovationLab',
      pagePostType2: 'single-page',
    });
  }
}
