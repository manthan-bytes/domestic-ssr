import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { OverviewRaceData } from '@core/interfaces/race-data.interface';
import { EventService, DataLayerService } from '@core/utils';

@Component({
  selector: 'app-event-detail-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnChanges {
  @Input() registrationData: OverviewRaceData;
  statusMsg: string;
  pricingStages = [];
  constructor(public eventService: EventService, private dataLayerService: DataLayerService) {}

  ngOnChanges(): void {
    this.getRaceData();
  }

  ngOnInit(): void {
    this.getRaceData();
  }

  getRaceData() {
    if (this.registrationData) {
      this.pricingStages = [];
      const pricing = this.registrationData.updatedPricing;

      if (pricing.REGULAR) {
        this.pricingStages.push(pricing.REGULAR);
      }

      if (pricing.SIX_PACK) {
        this.pricingStages.push(pricing.SIX_PACK);
      }

      if (pricing.ULTRA) {
        this.pricingStages.push(pricing.ULTRA);
      }

      if (pricing.HIGH_SCHOOL) {
        this.pricingStages.push(pricing.HIGH_SCHOOL);
      }

      if (pricing.BLACK_LOOP) {
        this.pricingStages.push(pricing.BLACK_LOOP);
      }

      this.statusMsg = this.eventService.getStatusMsg(this.registrationData);
    }
  }

  getCategoryRunnersMax(eventType: string, category: string): number {
    const eventTypes = {
      RELAY: {
        REGULAR: 12,
        ULTRA: 6,
        HIGH_SCHOOL: 12,
      },
      TRAIL: {
        REGULAR: 8,
        ULTRA: 4,
        HIGH_SCHOOL: 8,
        BLACK_LOOP: 2,
      },
      SPRINT: {
        REGULAR: 6,
        ULTRA: 3,
        HIGH_SCHOOL: 6,
      },
      SUNSET: {
        REGULAR: 4,
        ULTRA: 2,
        HIGH_SCHOOL: 4,
        BLACK_LOOP: 2,
      },
      TRAIL_SPRINT: {
        REGULAR: 4,
        ULTRA: 2,
        HIGH_SCHOOL: 4,
        BLACK_LOOP: 2,
      },
    };
    return eventTypes[eventType][category];
  }

  eCommerceAddToCartItemEvent(event, price, teamType) {
    teamType = teamType === 'Regular' ? 'Standard' : teamType;
    this.dataLayerService.eCommerceAddToCartItemEvent({
      item_name: event.name, // race name
      item_id: `${event.id}`, //race ID
      price: `${price}`, //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: event.type === 'relay' ? 'road' : event.type, // we can use this for race type for example
      item_category2: event.start_city, // we can use this for the race geolocation
      item_category3: event.end_city, //any other specification
      item_category4: event.alias, //any other specification
      item_variant: teamType, // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }
}
