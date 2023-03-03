import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { StaticPageService } from '@core/data/static-page/static-page.service';
import { RoadPartners } from '@core/interfaces/road-partner.interface';

@Component({
  selector: 'app-trail-partner',
  templateUrl: './trail-partner.component.html',
  styleUrls: ['./trail-partner.component.scss'],
})
export class TrailPartnerComponent implements OnInit {
  trailPartners: RoadPartners[];

  public trailPartnerData = {
    first_name: null,
    last_name: null,
    company_name: null,
    email: null,
    phone: null,
    opportunity: null,
    race_type: 'trail',
  };

  constructor(private staticPageService: StaticPageService, private newVisitorService: NewVisitorService) {}

  ngOnInit(): void {
    this.supportPartnersData();
    this.newVisitorService.popUp();
  }

  supportPartnersData() {
    this.staticPageService.getSupportPartners().subscribe((response) => {
      this.trailPartners = response;
    });
  }

  hidePopups() {
    this.trailPartners.forEach((partner) => {
      partner.showSupportingPopup = false;
      partner.showOfficialPopup = false;
    });
  }

  supportPartnerFormData() {
    this.staticPageService.supportPartnerFormData(this.trailPartnerData).subscribe((response) => {});
  }
}
