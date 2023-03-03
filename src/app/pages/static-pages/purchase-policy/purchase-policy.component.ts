import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-purchase-policy',
  templateUrl: './purchase-policy.component.html',
  styleUrls: ['./purchase-policy.component.scss'],
})
export class PurchasePolicyComponent implements OnInit {
  constructor(private dataLayerService: DataLayerService, private newVisitorService: NewVisitorService) {}
  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'privacy-policy',
      pagePostType: 'privacyPolicy',
      pagePostType2: 'single-page',
    });
    this.newVisitorService.popUp();
  }
}
