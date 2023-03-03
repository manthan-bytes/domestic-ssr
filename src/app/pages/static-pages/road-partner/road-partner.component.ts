import { Component, OnInit } from '@angular/core';
import { NewVisitorService } from '@core/data';
import { StaticPageService } from '@core/data/static-page/static-page.service';
import { RoadPartners } from '@core/interfaces/road-partner.interface';

@Component({
  selector: 'app-road-partner',
  templateUrl: './road-partner.component.html',
  styleUrls: ['./road-partner.component.scss'],
})
export class RoadPartnerComponent implements OnInit {
  roadPartners: RoadPartners[] = [];

  roadPartnersData = {
    first_name: null,
    last_name: null,
    company_name: null,
    email: null,
    phone: null,
    opportunity: null,
    race_type: 'relay',
  };

  constructor(private staticPageService: StaticPageService, private newVisitorService: NewVisitorService) {}

  ngOnInit(): void {
    this.supportPartnersData();
    this.newVisitorService.popUp();
  }

  supportPartnersData() {
    this.staticPageService.getSupportPartners().subscribe((response) => {
      this.roadPartners = response;
    });
  }

  hidePopups() {
    this.roadPartners.forEach((partner) => {
      partner.showSupportingPopup = false;
      partner.showOfficialPopup = false;
    });
  }

  supportPartnerFormData() {
    this.staticPageService.supportPartnerFormData(this.roadPartnersData).subscribe((response) => {}, this.handleError);
  }

  handleError() {
    console.error('Error');
  }
}
