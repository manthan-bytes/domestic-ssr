import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { DataLayerService } from '@core/utils';
import { headerRoutes } from '@core/utils/routes-path.constant.service';
@Component({
  selector: 'app-what-is-ragnar',
  templateUrl: './what-is-ragnar.component.html',
  styleUrls: ['./what-is-ragnar.component.scss'],
})
export class WhatIsRagnarComponent implements OnInit {
  public headerRoutes = headerRoutes;
  constructor(private dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}
  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'what-is-ragnar',
      pagePostType: 'whatIsRagnar',
      pagePostType2: 'single-page',
    });

    this.newVisitorService.popUp();
  }
}
