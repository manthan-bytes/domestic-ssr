import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { Map, NavigationControl, LngLatBounds, LngLat, Marker, Popup } from 'mapbox-gl';
import { DataLayerService, EventService, MapBoxService, MobileDetectionService, RACE_CONFIG } from '@core/utils';
import { NewVisitorService, RagnarCMSDataService } from '@core/data';
import lodashCloneDeep from 'lodash/cloneDeep';
import loadshMeanBy from 'lodash/meanBy';
import lodashOrderBy from 'lodash/orderBy';
import loadashFind from 'lodash/find';
import loadashIsEmpty from 'lodash/isEmpty';
import { DateFormatPipe } from '@core/pipes/date-format.pipe';
import { UtilsService } from '@core/utils/utils.service';
import { MapCustomPipe } from '@core/pipes/map-custom.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { eventDetailMapFields } from '@core/graphql/graphql';
import { TranslateService } from '@ngx-translate/core';
import { FetchRaceList } from '@core/interfaces/gql-data.interface';
import { AppliedFilters } from '@core/interfaces/applied-filters.interface';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import { EventData, MapEventsData } from '@core/interfaces/map-events.interface';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

import * as $ from 'jquery';
import { TinySliderService } from '@core/utils/tiny-slider.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  private mapBoxConfig;
  private initialMapConfig = {};
  private markers: MapEventsData[] = [];
  private mapBoxMarker = [];
  private mapBoxLastPopUp: Marker;
  private lat = 37.75;
  private lng = -122.41;
  isSliderInitialized = 0;
  public script;
  inputFocusCount = 0;

  public map: Map;
  public events: FetchRaceList[] = [];
  public allEvents: unknown = [];
  public isRaceSelected: boolean;
  public searchText: string;
  public allMonths = [];
  public americaStates: Array<{ name: string; value: string; type: string }> = [
    { name: 'MIDWEST', value: 'MIDWEST', type: 'Location' },
    { name: 'MOUNTAIN WEST', value: 'MOUNTAIN WEST', type: 'Location' },
    { name: 'NORTHEAST', value: 'NORTHEAST', type: 'Location' },
    { name: 'SOUTH', value: 'SOUTH', type: 'Location' },
    { name: 'WEST COAST', value: 'WEST COAST', type: 'Location' },
    // { name: 'CANADA', value: 'CANADA', type: 'Location' },
  ];
  public europeStates: Array<{ name: string; value: string; type: string }> = [
    { name: 'United Kingdom', value: 'UK', type: 'Location' },
    { name: 'Germany', value: 'DE', type: 'Location' },
    { name: 'Sweden', value: 'SE', type: 'Location' },
    { name: 'Spain', value: 'ES', type: 'Location' },
  ];
  public emptyArray = [];
  public countries = [
    {
      name: 'United States',
      value: 'United States',
      type: 'Location',
      states: this.americaStates,
    },
    // {
    //   name: 'Europe',
    //   value: 'Europe',
    //   type: 'Location',
    //   states: this.europeStates,
    // },
    // { name: 'Australia', value: 'Australia', type: 'Location', states: this.emptyArray },
    // { name: 'South Africa', value: 'South Africa', type: 'Location', states: this.emptyArray },
  ];
  public usaStates = [];
  public positionStates = ['NORTHEAST', 'SOUTH', 'MIDWEST', 'MOUNTAIN WEST', 'WEST COAST', 'CANADA'];
  public selectedFilter = {
    locationName: null,
    typeName: null,
    date: [],
    sortName: 'Name',
    sortOn: 'aliasName',
    allMonths: this.allMonths,
  };
  eventTypeTitle = {
    relay: 'Reebok Ragnar',
    trail: 'Ragnar Trail',
    sunset: 'Ragnar Sunset',
    sprint: 'Ragnar Sprint',
    trail_sprint: 'Ragnar Trail Sprint',
  };
  filterSearchText = '';
  listTabView = false;
  isMobile = false;
  uiHandler = {
    sideBarDefault: false,
    openDrawer: false,
    isMobileFooter: false,
    isMapRenderedOnce: false,
    isMobileMapRender: false,
    isOpenDateDropDown: false,
    isOpenLocationDropDown: false,
    isOpenRaceTypeDropDown: false,
    showTrailSubRaces: false,
  };
  toogleSubRegion = true;
  toogleTrailRace = false;

  public appliedFilters: AppliedFilters[] = [];
  public selectedEvent: OverviewRaceData = null;
  constructor(
    private mapBoxService: MapBoxService,
    private ragnarCMSDataService: RagnarCMSDataService,
    private eventService: EventService,
    private dateFormatPipe: DateFormatPipe,
    private mapCustomPipe: MapCustomPipe,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private slider: TinySliderService,
    private renderer2: Renderer2,
    private dataLayerService: DataLayerService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private newVisitorService: NewVisitorService,
    private MobileDetectionService: MobileDetectionService,
  ) {
    this.isRaceSelected = false;
    this.getMonths();
  }
  ngOnInit() {
    this.uiHandler.isMobileMapRender = this.MobileDetectionService.isAnyMobile() ? true : false;
    // this.newVisitorService.popUp();
    this.dataLayerService.pageInitEvent({
      screen_name: 'map',
      pagePostType: 'map',
      pagePostType2: 'single-page',
    });
    this.script = this.renderer2.createElement('script');

    this.script.text = `
    (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:2618093,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
  `;

    this.renderer2.appendChild(this.document.body, this.script);
    // Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.MAP_BOX.accessToken);
    // this.map = new mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/streets-v11', zoom: 13, center: [this.lng, this.lat] });
    this.map = new mapboxgl.Map({
      accessToken: environment.MAP_BOX.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
      center: [this.lng, this.lat],
    });
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    this.ragnarCMSDataService.getRaces().subscribe(
      (res) => {
        this.events = JSON.parse(JSON.stringify(lodashOrderBy(res.data.fetchRaceList, ['aliasName'], ['asc'])));
        this.getRegionsFromCity();
        this.allEvents = this.events;
        this.eventService.setStatus(this.events);
        this.intializeMapBox(this.events);
        this.clickOnFilterManager('location', this.countries[0]);
        const urlFilters = this.parseUrlParametersToFilterObject();
        if (urlFilters && Array.isArray(urlFilters) && !loadashIsEmpty(urlFilters)) {
          urlFilters.forEach((element) => {
            if (element.type === 'Road/Trail') {
              this.selectedFilter.typeName = element.name;
              this.handleFilterIfNotExist(element, 'type');
            } else if (element.type === 'Location') {
              this.selectedFilter.locationName = element.name;
              this.handleFilterIfNotExist(element, 'location');
            } else if (element.type === 'Dates') {
              element.isSelected = true;
              this.handleFilterIfNotExist(element, 'Dates');
            }
          });
        }
      },
      (err) => {
        console.error(err);
      },
    );
    this.translate.setDefaultLang('en');
    $(document).ready(() => {
      $('.race_details_mobile .selected_city_view').animate({ margin: '-100% 0 0 0' });
      if (isPlatformBrowser(this.platformId) && window.innerWidth <= 767) {
        $(window).scroll((event) => {
          const scroll = $(window).scrollTop();
          if (scroll >= $('.pre_footer').offset().top) {
            $('.race_register_details').hide();
          } else {
            $('.race_register_details').show();
          }
        });
      }
    });
  }
  ngOnDestroy() {
    this.renderer2.removeChild(this.document.body, this.script);
  }
  tinySliderIntialize() {
    if (this.isSliderInitialized === 0) {
      this.isSliderInitialized++;
      setTimeout(() => {
        const tns = this.slider.nativeSlider;
        tns({
          container: '#tiny-map-slider',
          items: 3,
          // slideBy: 'page',
          center: true,
          controls: true,
          mouseDrag: true,
          autoplayButtonOutput: false,
          autoplay: true,
          nav: false,
          autoWidth: true,
          arrowKeys: false,
          loop: true,
          gutter: 10,
          responsive: {
            0: {
              items: 1,
              autoHeight: true,
            },
            767: {
              items: 3,
              autoHeight: false,
            },
          },
          controlsText: [
            '<span aria-hidden="true" class="carousel-control-prev-icon"></span>',
            '<span aria-hidden="true" class="carousel-control-next-icon"></span>',
          ],
        });
      }, 1);
    }
  }
  getRegionsFromCity() {
    this.events.forEach((event) => {
      if (event.country === 'USA' || event.country === 'Canada') {
        event.subregion = event.region;
        if (this.usaStates.indexOf(event.subregion) < 0) {
          this.usaStates.push(event.subregion);
          if (this.positionStates.indexOf(event.subregion) > -1) {
            this.countries[0].states[this.positionStates.indexOf(event.subregion)] = {
              name: event.subregion,
              value: event.subregion,
              type: 'Location',
            };
          }
        }
        event.region = 'United States';
      } else if (event.region === 'EUROPE') {
        event.region = 'Europe';
        event.subregion = RACE_CONFIG.subregion[event.country];
      } else if (event.country === 'Australia') {
        event.region = 'Australia';
      } else if (event.country === 'South Africa') {
        event.region = 'South Africa';
      }
    });
  }

  intializeMapBox(events: FetchRaceList[], filters?: AppliedFilters[]) {
    this.mapBoxConfig = this.mapBoxService.getMapBoxConfig(this.map);
    this.initialMapConfig = lodashCloneDeep(this.mapBoxConfig);
    Object.assign(this.mapBoxConfig, this.initialMapConfig);
    this.mapBoxLastPopUp = null;

    let bound = null;
    if (filters && events.length > 0 && filters.length > 0) {
      bound = new mapboxgl.LngLatBounds();
      events.forEach((event) => {
        const latlng = new mapboxgl.LngLat(event.lng, event.lat);
        bound.extend(latlng);
      });
      const locationFilter = filters.filter((filter) => filter.type === 'location');
      if (locationFilter.length > 0) {
        this.mapBoxConfig.center = {
          // tslint:disable-next-line: no-string-literal
          latitude: loadshMeanBy(events, (e: any) => parseFloat(e.lat)) || this.initialMapConfig['center'].latitude,
          // tslint:disable-next-line: no-string-literal
          longitude: loadshMeanBy(events, (e: any) => parseFloat(e.lng)) || this.initialMapConfig['center'].longitude,
        };
        this.mapBoxConfig.zoom = 5;
      } else {
        this.mapBoxConfig.zoom = 4;
      }
    } else {
      this.resetMapIntialState();
    }
    if (bound) {
      this.map.fitBounds(bound, { padding: { top: 100, bottom: 100, left: 100, right: 100 }, maxZoom: 10 });
    }
    if (this.mapBoxMarker !== null) {
      this.mapBoxMarker.forEach((pin) => {
        pin.remove();
      });
    }

    this.markers = this.mapBoxService.getEventMarkers(events);
    this.markers.forEach((ele, index) => {
      const marker = new mapboxgl.Marker({ color: '#f4792f', scale: 0.6 });
      const route =
        ele.eventData.type === 'relay' || ele.eventData.type === 'sprint'
          ? `${ele.eventData.startCity} to ${ele.eventData.endCity}`
          : `${ele.eventData.startCity}`;
      this.mapBoxMarker.push(marker);
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnMove: true,
        className: 'mapboxgl_override',
        offset: {
          bottom: [171, -17],
          top: [120, -17],
          right: [3, 26],
          left: [-1, 27],
          'top-left': [0, -17],
          'bottom-left': [0, -17],
          'bottom-right': [-102, -17],
        },
      })
        .setHTML(
          `
        <div class='race_img'>
          <img src='${ele.eventData.tile}'>
        </div>
        <div id='${ele.id}${index}' class='race_highlights'>
          <div class='race_event_type'>RAGNAR ${ele.eventData.type.toUpperCase() === 'RELAY' ? 'ROAD' : ele.eventData.type.toUpperCase()
          }</div>
          <div class='race_city'>${ele.eventData.name}</div>
          <div class='race_date_venue'>
            <div class='race_date'>${this.dateFormatPipe.transform(ele.eventData.startDate, 'MMMM')} ${this.dateFormatPipe.transform(
            ele.eventData.startDate,
            'DD',
          )}-${this.dateFormatPipe.transform(ele.eventData.endDate, 'DD')}, ${this.dateFormatPipe.transform(
            ele.eventData.startDate,
            'YYYY',
          )}</div>
            <span class='race_venue_info'>${route}</span>
          </div>
        </div>`,
        )
        .on('open', (e) => {
          popup.getElement().addEventListener(
            'click',
            (j) => {
              this.selectEventFromList(ele.eventData, true, true);
              j.stopPropagation();
            },
            true,
          );
        });

      marker.setLngLat([ele.longitude, ele.latitude]).setPopup(popup).addTo(this.map);
      const markerDiv = marker.getElement();
      markerDiv.addEventListener('mouseenter', () => {
        if (!this.MobileDetectionService.isAnyMobile()) {
          if (this.mapBoxLastPopUp) {
            this.mapBoxLastPopUp.togglePopup();
          }
          this.mapBoxLastPopUp = marker.togglePopup();
        }
      });

      markerDiv.addEventListener(
        'click',
        (e) => {
          this.selectEventFromList(ele.eventData, true, true);
          e.stopPropagation();
        },
        true,
      );

      this.map.on('click', () => {
        this.mapBoxLastPopUp = null;
      });
    });
  }

  public selectEventFromList(selectedEvent, willOpen, isMobile) {
    this.isSliderInitialized = 0;
    let isEventRendered = false;
    $(window).scrollTop(0);
    if (this.uiHandler.isMobileMapRender) {
      this.uiHandler.isMobileMapRender = false;
      this.renderMapAgain();
    }
    if (isMobile && this.MobileDetectionService.isAnyMobile()) {
      this.isMobile = true;
      this.uiHandler.isMobileMapRender = false;
      this.listTabView = !this.listTabView;
    }
    if (willOpen && this.isMobile) {
      this.uiHandler.isMobileFooter = true;
      this.renderSingleEvent(selectedEvent);
      isEventRendered = true;
    } else if (willOpen) {
      this.uiHandler.sideBarDefault = true;
    } else {
      this.uiHandler.sideBarDefault = false;
    }

    if (this.isMobile) {
      if (isMobile) {
        this.uiHandler.isMobileFooter = false;
        this.uiHandler.sideBarDefault = true;
        this.listTabView = false;
        if (!isEventRendered) {
          this.renderSingleEvent(selectedEvent);
        }
      }
    } else {
      if (!isEventRendered) {
        this.renderSingleEvent(selectedEvent);
      }
    }

    // DATA LAYER
    this.dataLayerService.eCommerceSelectItemEvent({
      item_name: selectedEvent.name, // race name
      item_id: `${selectedEvent.id}`, //race ID
      price: '', //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: selectedEvent.type === 'relay' ? 'road' : selectedEvent.type, // we can use this for race type for example
      item_category2: selectedEvent.start_city, // we can use this for the race geolocation
      item_category3: selectedEvent.end_city, //any other specification
      item_category4: selectedEvent.alias, //any other specification
      item_variant: '', // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }
  public renderMapAgain() {
    if (!this.uiHandler.isMapRenderedOnce) {
      this.uiHandler.isMapRenderedOnce = true;
      setTimeout(() => {
        if (isPlatformBrowser(this.platformId)) {
          window.dispatchEvent(new Event('resize'));
          this.intializeMapBox(this.events);
        }
      }, 350);
    }
  }
  public renderSingleEvent(selectedEvent: EventData) {
    this.mapBoxConfig.center = { latitude: selectedEvent.lat, longitude: selectedEvent.lng };
    this.mapBoxConfig.zoom = 6;
    this.selectedEvent = null;

    const bound = new mapboxgl.LngLatBounds();
    bound.extend(new mapboxgl.LngLat(selectedEvent.lng, selectedEvent.lat));
    this.map.fitBounds(bound, { padding: { top: 200, bottom: 200, left: 200, right: 200 }, maxZoom: 10 });

    this.isRaceSelected = true;
    this.ragnarCMSDataService.getRaceMapData(selectedEvent.id, eventDetailMapFields).subscribe((res: OverviewRaceData) => {
      res.menuUrl = `event-detail\\${res.type}\\${res.alias}`;
      res.aliasName = this.utilsService.removeBrandNameFromRaceName(res.name);
      this.eventService.setSingleStatus(res);
      this.selectedEvent = res;
      this.dataLayerService.eCommerceViewItemEvent({
        item_name: this.selectedEvent.name, // race name
        item_id: `${this.selectedEvent.id}`, //race ID
        price: '', //race price
        item_brand: 'ragnar', // we can use runragnar, or any other specification
        item_category: this.selectedEvent.type === 'relay' ? 'road' : this.selectedEvent.type, // we can use this for race type for example
        item_category2: this.selectedEvent.start_city, // we can use this for the race geolocation
        item_category3: this.selectedEvent.end_city, //any other specification
        item_category4: this.selectedEvent.alias, //any other specification
        item_variant: '', // we can use this for example the team type
        quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
      });
      if (this.selectedEvent.files.photos.length) {
        this.tinySliderIntialize();
      }
    }, this.handleError);
  }

  public removeFilter(removeFilterItem) {
    const index = this.appliedFilters.findIndex((filter) => filter.name === removeFilterItem.name);
    this.appliedFilters.splice(index, 1);

    if (removeFilterItem.type === 'location' || removeFilterItem.type === 'sub-region') {
      this.selectedFilter.locationName = null;
    } else if (removeFilterItem.type === 'type') {
      this.selectedFilter.typeName = null;
    } else if (removeFilterItem.type === 'Dates') {
      this.selectedFilter.date.splice(
        this.selectedFilter.date.findIndex((filter) => filter === removeFilterItem.name),
        1,
      );
      this.allMonths.forEach((month) => {
        if (month.name === removeFilterItem.name) {
          month.isSelected = false;
        }
      });
    }
    this.resetMapMarkers();
  }

  public clickOnFilterManager(
    clickedOn: string,
    data?: { name: string; value: string; type?: string; states?: Array<{ name: string; value: string; type: string }> },
    removeAll?: boolean,
  ) {
    if (this.uiHandler.sideBarDefault && !this.MobileDetectionService.isAnyMobile()) {
      this.uiHandler.sideBarDefault = false;
    }
    this.isRaceSelected = false;
    switch (clickedOn) {
      case 'sort':
        this.selectedFilter.sortOn = data.value;
        this.selectedFilter.sortName = data.name;
        if (data.name === 'Date') {
          this.events = lodashOrderBy(
            this.events.filter((f) => !f.coming_soon),
            data.value,
            'asc',
          );
        } else if (data.name === 'Location') {
          this.events = lodashOrderBy(this.events, data.value, 'desc');
        } else {
          this.events = lodashOrderBy(this.events, data.value, 'asc');
        }
        break;
      case 'type':
        this.selectedFilter.typeName = data.name;
        this.uiHandler.isOpenRaceTypeDropDown = true;
        this.handleFilterIfNotExist(data, clickedOn);
        if (data.value === 'trail') {
          this.toogleTrailRace = !this.toogleTrailRace;
        }
        break;
      case 'sub-raceType':
        this.selectedFilter.typeName = data.name;
        this.uiHandler.isOpenRaceTypeDropDown = true;
        this.handleFilterIfNotExist(data, clickedOn);
        break;
      case 'location':
        this.selectedFilter.locationName = data.name;
        this.uiHandler.isOpenLocationDropDown = true;
        this.handleFilterIfNotExist(data, clickedOn);
        this.toogleSubRegion = !this.toogleSubRegion;
        break;
      case 'sub-region':
        this.selectedFilter.locationName = data.name;
        this.uiHandler.isOpenLocationDropDown = true;
        this.handleFilterIfNotExist(data, clickedOn);
        break;
      case 'Dates':
        // tslint:disable-next-line: no-string-literal
        data['isSelected'] = true;
        this.uiHandler.isOpenDateDropDown = true;
        this.handleFilterIfNotExist(data, clickedOn);
        break;
      case 'clearFilter':
        this.appliedFilters = [];
        this.selectedFilter.typeName = this.selectedFilter.locationName = null;
        this.selectedFilter.date = [];
        this.allMonths.forEach((month) => {
          // tslint:disable-next-line: no-string-literal
          month['isSelected'] = false;
        });
        this.resetMapMarkers();
        break;
      case 'removeFilter':
        if (data.type === 'Dates') {
          if (removeAll) {
            this.getMonths();
            this.selectedFilter.allMonths.forEach((month) => {
              if (this.appliedFilters.findIndex((filter) => filter.type === data.type) >= 0) {
                this.appliedFilters.splice(
                  this.appliedFilters.findIndex((filter) => filter.type === data.type),
                  1,
                );
              }
              month.isSelected = false;
            });
            this.selectedFilter.date = [];
            this.resetMapIntialState();
            return;
          } else {
            // tslint:disable-next-line: no-string-literal
            data['isSelected'] = false;
            this.appliedFilters.splice(
              this.appliedFilters.findIndex((filter) => filter.type === data.type),
              1,
            );
          }
        } else {
          this.appliedFilters.splice(
            this.appliedFilters.findIndex((filter) => filter.type === data.type),
            1,
          );
        }
        if (data.type === 'Road/Trail') {
          this.selectedFilter.typeName = null;
        } else if (data.type === 'Location' || data.type === 'SubRegion') {
          this.selectedFilter.locationName = null;
        } else if (data.type === 'Dates') {
          this.selectedFilter.date.splice(this.selectedFilter.date.indexOf(data.name), 1);
          this.allMonths.forEach((month) => {
            month.isSelected = false;
          });
        }
        this.resetMapMarkers();
        break;
    }
  }

  private handleFilterIfNotExist(data: { name: string; value: string; type?: string }, clcikedOn: string) {
    let index = 0;
    if (clcikedOn === 'Dates') {
      index = this.appliedFilters.findIndex((item) => item.name === data.name);
      if (index < 0) {
        this.selectedFilter.date.push(data.name);
      }
    } else {
      index = this.appliedFilters.findIndex((item) => item.type === clcikedOn);
    }
    data.type = clcikedOn;
    // reset filter for black loop
    if (clcikedOn === 'sub-raceType' || clcikedOn === 'type') {
      for (let i = 0; i < this.appliedFilters.length; i++) {
        if (this.appliedFilters[i].type === 'type' || this.appliedFilters[i].type === 'sub-raceType') {
          this.appliedFilters.splice(i, 1);
        }
      }
    }
    // reset filter when sub-region filter
    if (clcikedOn === 'sub-region' || clcikedOn === 'location') {
      for (let i = 0; i < this.appliedFilters.length; i++) {
        if (this.appliedFilters[i].type === 'location' || this.appliedFilters[i].type === 'sub-region') {
          this.appliedFilters.splice(i, 1);
        }
      }
    }

    if (index >= 0) {
      this.appliedFilters[index] = data;
    } else {
      this.appliedFilters.push(data);
    }

    this.resetMapMarkers();
  }

  public getMonths() {
    this.allMonths = [
      { name: 'JAN', value: '0', type: 'Dates', isSelected: false },
      { name: 'FEB', value: '1', type: 'Dates', isSelected: false },
      { name: 'MAR', value: '2', type: 'Dates', isSelected: false },
      { name: 'APR', value: '3', type: 'Dates', isSelected: false },
      { name: 'MAY', value: '4', type: 'Dates', isSelected: false },
      { name: 'JUN', value: '5', type: 'Dates', isSelected: false },
      { name: 'JUL', value: '6', type: 'Dates', isSelected: false },
      { name: 'AUG', value: '7', type: 'Dates', isSelected: false },
      { name: 'SEP', value: '8', type: 'Dates', isSelected: false },
      { name: 'OCT', value: '9', type: 'Dates', isSelected: false },
      { name: 'NOV', value: '10', type: 'Dates', isSelected: false },
      { name: 'DEC', value: '11', type: 'Dates', isSelected: false },
    ];
    this.selectedFilter.allMonths = this.allMonths;
  }

  private resetMapIntialState() {
    // tslint:disable-next-line: no-string-literal
    this.mapBoxConfig.center = this.initialMapConfig['center'];
    if (this.MobileDetectionService.isAnyMobile()) {
      this.mapBoxConfig.zoom = 3;
    } else {
      this.mapBoxConfig.zoom = 4;
    }
    this.map.flyTo({ center: [this.mapBoxConfig.center.longitude, this.mapBoxConfig.center.latitude], zoom: this.mapBoxConfig.zoom - 1 });
  }
  public resetMapMarkers() {
    this.events = this.mapCustomPipe.transform(this.allEvents, this.appliedFilters);
    this.intializeMapBox(this.events, this.appliedFilters);
    this.parseFilterObjectToUrlParameters();
  }
  public parseFilterObjectToUrlParameters() {
    const urlAllDates = [];
    let roadTypeName = null;
    let locationName = null;

    this.appliedFilters.forEach((element) => {
      if (element.type === 'type' || element.type === 'sub-raceType') {
        roadTypeName = element.value;
      } else if (element.type === 'location' || element.type === 'sub-region') {
        locationName = element.value;
      } else if (element.type === 'Dates') {
        urlAllDates.push(element.name.toLowerCase());
      }
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: roadTypeName ? roadTypeName : null,
        location: locationName ? locationName : null,
        dates: urlAllDates.length > 0 ? urlAllDates.join(',') : null,
      },
    });
  }
  public parseUrlParametersToFilterObject() {
    const filterObject = [];
    this.route.queryParams.subscribe((urlParams) => {
      if (Object.keys(urlParams).length > 0) {
        Object.keys(urlParams).forEach((key) => {
          const obj = urlParams[key];
          if (
            (key === 'type' && obj === 'relay') ||
            (key === 'type' && obj === 'trail') ||
            (key === 'type' && obj === 'sunset') ||
            (key === 'type' && obj === 'trail_sprint') ||
            (key === 'type' && obj === 'sprint') ||
            (key === 'type' && obj === 'black loop')
          ) {
            filterObject.push({
              name:
                obj === 'relay'
                  ? 'Road'
                  : obj === 'trail'
                    ? 'Trail'
                    : obj === 'sunset'
                      ? 'Sunset'
                      : obj === 'sprint'
                        ? 'Sprint'
                        : obj === 'trail_sprint'
                          ? 'Trail Sprint'
                          : 'Black Loop',
              value: obj,
              type: 'Road/Trail',
            });
          } else if (key === 'location') {
            filterObject.push({ name: obj, value: obj, type: 'Location' });
          } else if (key === 'dates') {
            if (obj) {
              obj.split(',').forEach((value) => {
                const getDate = loadashFind(this.allMonths, ['name', value.toUpperCase()]);
                if (getDate) {
                  getDate.isSelected = true;
                  filterObject.push(getDate);
                }
              });
            }
          }
        });
      }
    });
    return filterObject;
  }
  goBackToListView() {
    this.uiHandler.sideBarDefault = false;
    this.isSliderInitialized = 0;
    this.selectedEvent = null;
    this.isRaceSelected = false;

    if (this.MobileDetectionService.isAnyMobile()) {
      this.listTabView = true;
      this.resetMapIntialState();
    } else {
      if (!this.uiHandler.isMobileMapRender && this.MobileDetectionService.isAnyMobile()) {
        this.uiHandler.isMobileMapRender = true;
        // this.intializeMapBox(this.events, this.appliedFilters);
      }
      this.intializeMapBox(this.events, this.appliedFilters);
    }
  }
  private handleError(error) {
    console.error(error);
  }
  toogleSideBar() {
    this.uiHandler.openDrawer = !this.uiHandler.openDrawer;

    if (this.uiHandler.openDrawer) {
      setTimeout(() => {
        isPlatformBrowser(this.platformId) && window.dispatchEvent(new Event('resize'));
      }, 100);
    } else {
      setTimeout(() => {
        isPlatformBrowser(this.platformId) && window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }
  filterRaces() {
    this.filterSearchText = lodashCloneDeep(this.searchText).toLowerCase();
  }
  triggerMobileSwitchMap(clickedOn) {
    this.renderMapAgain();
    if (clickedOn === 'map') {
      this.isMobile = true;
      this.uiHandler.isMobileMapRender = false;
      this.listTabView = !this.listTabView;
    } else if (clickedOn === 'list') {
      this.isMobile = false;
      this.uiHandler.isMobileFooter = false;
      this.uiHandler.isMobileMapRender = true;
      this.listTabView = !this.listTabView;
    } else if (clickedOn === 'footer') {
      this.isMobile = false;
      this.uiHandler.isMobileMapRender = true;
      this.listTabView = !this.listTabView;
    } else if (clickedOn === 'footerClose') {
      this.uiHandler.isMobileFooter = false;
      this.resetMapIntialState();
    }
  }

  eCommerceAddToCartItemEvent(event) {
    this.dataLayerService.eCommerceAddToCartItemEvent({
      item_name: event.name, // race name
      item_id: `${event.id}`, //race ID
      price: ``, //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: event.type === 'relay' ? 'road' : event.type, // we can use this for race type for example
      item_category2: event.start_city, // we can use this for the race geolocation
      item_category3: event.end_city, //any other specification
      item_category4: event.alias, //any other specification
      item_variant: '', // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }

  formElementEnter() {
    this.inputFocusCount++;
    if (this.inputFocusCount === 1) {
      this.dataLayerService.inputFocusEvent({
        formName: 'search_ragnar_map',
        searchText: this.searchText || '',
      });
    }
  }
  formElementExit() {
    this.inputFocusCount = 0;
    this.dataLayerService.inputBlurEvent({
      formName: 'search_ragnar_map',
      searchText: this.searchText || '',
    });
  }
}
