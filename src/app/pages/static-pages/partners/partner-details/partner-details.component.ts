import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { StaticPageService, RagnarCMSDataService } from '@core/data';
import { Testimonials } from '@core/interfaces/static-pages.interface';
import { DataLayerService } from '@core/utils';
import { Partner } from './partner';

@Component({
  selector: 'app-partner-details',
  templateUrl: './partner-details.component.html',
  styleUrls: ['./partner-details.component.scss'],
})
export class PartnerDetailsComponent implements OnInit, OnDestroy {
  declare quotes: Testimonials[];
  declare slug: string;
  public partnerDetails: Partner;

  constructor(
    private staticPageService: StaticPageService,
    private rcmsDataService: RagnarCMSDataService,
    private route: ActivatedRoute,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.dataLayerService.pageInitEvent({
      screen_name: 'partner-details',
      pagePostType: 'partnerDetails',
      pagePostType2: 'single-page',
    });

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.slug = params.get('slug');
    });
    this.staticPageService.getBannersAndQuotes().subscribe((response) => {
      if (response.quotes.length) {
        this.quotes = response.quotes;
      }
    });

    this.rcmsDataService
      .getSponsorBySlug(this.slug, [
        'id',
        'name',
        'dealText',
        'featured',
        'logo',
        'logo_white',
        'logo_black',
        'description',
        'buttonTitle',
        'url',
      ])
      .subscribe((data: Partner) => {
        this.partnerDetails = data;
      });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('partnerId');
  }
}
