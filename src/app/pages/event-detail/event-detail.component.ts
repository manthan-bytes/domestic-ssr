import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { eventDetailRoutes, EventService, MetaTagsService } from '@core/utils';
import { raceDataFields } from '@core/graphql/graphql';
import { RagnarCMSDataService } from '@core/data/race/ragnar-cms.service';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import { TranslateService } from '@ngx-translate/core';
import { DataLayerService } from '@core/utils';
import * as $ from 'jquery';
import { DOCUMENT } from '@angular/common';
import { NewVisitorService } from '@core/data';
import { isPlatformBrowser } from '@angular/common';
import {getWindow} from "ssr-window";
@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  public show = {
    activeTab: 'overview',
  };
  public overviewData: OverviewRaceData;
  public pricingStages;
  public script;
  public porscheScript;
  public raceId: string;
  loadingGlobal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private ragnarCmsDataService: RagnarCMSDataService,
    public eventService: EventService,
    private dataLayerService: DataLayerService,
    private metaTagsService: MetaTagsService,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    // private newVisitorService: NewVisitorService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    // this.newVisitorService.popUp();
      this.script = this.renderer2.createElement('script');
      this.script.text = `
      (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:2618093,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
    `;
      this.renderer2.appendChild(this.document.body, this.script);
    // tslint:disable-next-line: deprecation
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment && this.router.url.includes(`/${eventDetailRoutes.main}`)) {
        this.show.activeTab = fragment;
        this.MoveActiveTabOption();
      }
      /* else if (!fragment && this.router.url.includes(`/${eventDetailRoutes.main}`)) {
        window.location.hash = 'overview';
      } */
    });
    // tslint:disable-next-line: deprecation
    this.route.url.subscribe((urlSegments) => {
      this.raceId = urlSegments && (urlSegments[1] || {}).path;
      this.getRaceDataFromGql();
    }, this.handleError);
    this.translate.setDefaultLang('en');
    this.StickyTabOption();
  }
  ngOnDestroy() {
    if (this.porscheScript) {
      this.renderer2.removeChild(this.document.body, this.porscheScript);
    }
    if (this.script) {
      this.renderer2.removeChild(this.document.body, this.script);
    }
  }
  getRaceDataFromGql = () => {
    this.loadingGlobal = true;
    // tslint:disable-next-line: deprecation
    this.ragnarCmsDataService.getRaceData(this.raceId, raceDataFields).subscribe((response: OverviewRaceData) => {
      this.metaTagsService.setGenricMetaTags({
        title: response.name + ' - Ragnar Relays',
        description: response.meta_description,
        keywords: response.meta_description,
        properties: {
          ogImage: response.files.banner,
          ogImageUrl: response.files.logo_white,
        },
      });
      this.overviewData = response;
      this.overviewData = this.eventService.setRegStatusFlags(this.overviewData);
      this.overviewData.regStatus = this.eventService.getStatus(this.overviewData);
      this.overviewData.regStatusLabel = this.eventService.getRegStatusLabel(this.overviewData.regStatus);
      this.pricingStages = this.overviewData.updatedPricing;
      if (this.overviewData.name.toLowerCase().includes('porsche')) {
        this.porscheScript = this.renderer2.createElement('script');
        this.porscheScript.text = `
        !function(w,d){if(!w.rdt){varp=w.rdt=function(){p.sendEvent?
          p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var
          t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js'.t.async=!0;var
          s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}
          (window,document) ;rdt('init',t2_3g6vc',
          {"optOut" :false,"useDecimalCurrency Values": true," aaid": "<AAID-HERE>", "email": "<EMAIL
          HERE>" ,"externalId":"<EXTERNAL-ID-HERE>","idfa":"<IDFA-HERE>"});rdt(track',
          'Page Visit');
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbg=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,' script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','418819220192487);
          fbq('track', 'Page View');
      `;
        this.renderer2.appendChild(this.document.body, this.porscheScript);
      }

      this.loadingGlobal = false;

      this.dataLayerService.eCommerceViewItemEvent({
        item_name: response.name, // race name
        item_id: `${response.id}`, // race ID
        price: '', // race price
        item_brand: 'ragnar', // we can use runragnar, or any other specification
        item_category: response.type === 'relay' ? 'road' : response.type, // we can use this for race type for example
        item_category2: response.start_city, // we can use this for the race geolocation
        item_category3: response.end_city, // any other specification
        item_category4: response.alias, // any other specification
        item_variant: '', // we can use this for example the team type
        quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
      });
    }, this.handleError);
    // tslint:disable-next-line: semicolon
  };
  private handleError(err) {
    this.loadingGlobal = false;
    console.error(err);
  }

  MoveActiveTabOption = () => {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && getWindow().innerWidth <= 767) {
        const tabOptions = this.elRef.nativeElement.querySelector('.tab-options');
        const tabLinks = tabOptions.querySelectorAll('li a');
  
        for (const link of tabLinks) {
          this.renderer2.listen(link, 'click', (event) => {
            zeroLeftOnly(link, tabOptions.querySelector('ul'), 100);
          });
        }
  
        // tslint:disable-next-line: only-arrow-functions
        function zeroLeftOnly(element, container, scrollSpeed) {
          const zeroLeft = element.getBoundingClientRect().left + container.scrollLeft;
          this.renderer2.animate(container, 'scrollLeft', container.scrollLeft, zeroLeft, scrollSpeed);
        }
      }
    });
    // tslint:disable-next-line: semicolon
  };

  StickyTabOption = () => {
    setTimeout(() => {
      if (isPlatformBrowser(this.platformId) && getWindow().innerWidth <= 767) {
        const tabOptions = this.elRef.nativeElement.querySelector('.event-detail .tab-options');
        const headerHeight = this.elRef.nativeElement.querySelector('.main_header').offsetHeight;
    
        this.renderer2.listen('window', 'scroll', () => {
          const scroll = getWindow().scrollY;
          if (scroll >= headerHeight) {
            this.renderer2.addClass(tabOptions, 'sticky');
          } else {
            this.renderer2.removeClass(tabOptions, 'sticky');
          }
        });
      }
    });
    // tslint:disable-next-line: semicolon
  };

  addPageInitEvent(screen_name) {
    const pagePostType = screen_name.replace(/(^|-)./g, (s) => s.slice(-1).toUpperCase());
    this.dataLayerService.pageInitEvent({
      screen_name,
      pagePostType,
      pagePostType2: 'single-page', 
    });
  }
}

/**
 * @todo : have to call the data service from here LIKE: 1) Overview 2) Get Ready 3)
 * Dates and updates. after that we need to send the relevant data to the relavant tab.
 * @todo cache the data of the different tab {can be used the service here...}
 * @todo active tab should be constant and suppose to be typed.
 * @todo write a switch case where we can write the different data to ask and like overview and with the cached service for all.
 */
