import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { OverviewRaceData } from '../interfaces/race-data.interface';

@Directive({
  selector: '[appLinkEventDetail]',
})
export class LinkEventDetailDirective implements AfterViewInit {
  @Input() selectedEvent: OverviewRaceData;
  private el: HTMLInputElement;

  constructor(public elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }
  ngAfterViewInit(): void {
    this.el.removeAttribute('link-event-detail');
    this.el.setAttribute('href', this.selectedEvent.menuUrl);
    this.el.setAttribute('target', '_self');
  }
}
