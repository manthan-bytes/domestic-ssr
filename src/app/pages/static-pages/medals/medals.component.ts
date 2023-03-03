import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-medals',
  templateUrl: './medals.component.html',
  styleUrls: ['./medals.component.scss'],
})
export class MedalsComponent implements OnInit {
  constructor(public dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}
  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'medals',
      pagePostType: 'medals',
      pagePostType2: 'single-page',
    });
    this.newVisitorService.popUp();
  }
}
