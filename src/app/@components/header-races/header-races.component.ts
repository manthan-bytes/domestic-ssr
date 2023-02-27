import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataLayerService } from 'src/app/@core/utils/data-layers.service';

@Component({
  selector: 'app-header-races',
  templateUrl: './header-races.component.html',
  styleUrls: ['./header-races.component.scss'],
})
export class HeaderRacesComponent implements OnInit {
  @Input() regionEvents;
  @Input() device: string;
  @Output() closeDropDown = new EventEmitter();
  constructor(private dataLayerService: DataLayerService) {}

  ngOnInit(): void {
    this.regionEvents = Array.isArray(this.regionEvents) ? this.regionEvents : [];
  }
  closeDropdown() {
    this.closeDropDown.next({ raceName: 'Races' });
  }

  eCommerceSelectItemDataLayer(event) {
    this.dataLayerService.eCommerceSelectItemEvent({
      item_name: event.name, // race name
      item_id: `${event.id}`, //race ID
      price: '', //race price
      item_brand: 'ragnar', // we can use runragnar, or any other specification
      item_category: event.type === 'relay' ? 'road' : event.type, // we can use this for race type for example
      item_category2: event.start_city, // we can use this for the race geolocation
      item_category3: event.end_city, //any other specification
      item_category4: event.alias, //any other specification
      item_variant: '', // we can use this for example the team type
      quantity: '1', // mainly it will be 1, but if someone register 2 team for the sme race it could be more
    });
  }
}
