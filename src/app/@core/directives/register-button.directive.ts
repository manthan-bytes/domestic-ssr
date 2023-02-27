import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[appRegisterButton]' })
export class RegisterButtonDirective implements OnInit {
  @Input() public ngModel;
  @Input() event; // TODO: Need to add Datatype or Interface.
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.setSlash(this.event);
  }

  setSlash(event) {
    let link: string;
    const checkout = './checkout/23759'; // 23894 for dev, 23759 for Prod
    if (event) {
      const notIn = ['115', '136', '114', '150', '120', '138', '98', '104', '139', '140', '107', '103'];
      if (event.regStatus === 'REGISTER' && !notIn.includes(event.id)) {
        link = event.reg_system && event.reg_system.eventURL ? event.reg_system.eventURL : '';
        /* TODO: Bhaumik check this code why we are not using the one i am asending from the cms... */
        link = 'https://' + (link ? link.replace('http://', '').replace('https://', '') : '');
      }
      if (event.id === '103') {
        this.el.setAttribute('href', checkout);
      }
      if (event.id === '104') {
        // CA : ontario_trail
        link = 'https://2mev.com/#!/events/ragnar-trail-ontario';
      }
      if (event.id === '107') {
        // UK : whitecliffs
        link = 'https://www.raceentry.com/races/reebok-ragnar-white-cliffs/2019/register';
      }
      if (event.id === '98') {
        // CA : niagara
        link = 'https://2mev.com/#!/events/usd-ragnar-road-niagara';
      }
      if (event.id === '138') {
        // UK : forestofdean
        link = 'https://raceroster.com/events/2020/24895/ragnar-trail-forest-of-dean-2020';
      }
      if (event.id === '120') {
        // SE : lake-malaren
        link = 'https://registration.marathongruppen.se/Registration.aspx?LanguageCode=en&RaceId=127';
      }
      if (event.id === '150') {
        // ES : madrid
        link = 'https://www.rockthesport.com/en/event/reebok-ragnar-road-madrid-salamanca';
      }
      if (event.id === '114') {
        // DE : wattenmeer
        link = 'http://my.raceresult.com/138508/registration?lang=en';
      }
      if (event.id === '115') {
        // AU : glenworth
        link =
          'https://endurancecui.active.com/new/events/52594553/select-race?e4p=51195f49-989a-428a-b9c7-3c98d29ba7f9&e4ts=1525877052&e4q=1b11767e-7513-4ca1-9b22-2a7049604c91&e4c=active&e4e=snawe00000000&e4h=d48f9060b3367a9f62ae0119df7f65ce&locale=en_AU&e4rt=Safetynet&_p=18541458550279621';
      }
      if (event.id === '136') {
        // MX : mexico
        link = 'https://web.asdeporte.com/inscripciones/?eventid=9961f370-d264-4784-93d0-42f48a3b39f1#login';
      }
      if (event.id === '139') {
        // ZA : capetown
        link = 'https://runragnar.co.za/register?slug=capetown';
      }
      if (event.id === '140') {
        // ZA : joburg
        link = 'https://runragnar.co.za/register?slug=joburg';
      }
      if (event.regStatus === 'WAIT_LIST') {
        link = event.waitlist_url;
        if (event.id === '107') {
          // UK : whitecliffs
          link = 'http://eepurl.com/dMFPpE';
        }
      }
      if (event.regStatus === 'PRELAUNCH') {
        link = event.prelaunch_url;
      }
      if (event.regStatus === 'LOTTERY') {
        link = event.reg_system && event.reg_system.eventURL ? event.reg_system.eventURL : '';
        link = 'https://' + link.replace('http://', '').replace('https://', '');
      }
      if (['NOT_OPEN_YET', 'FULL', 'SOLD_OUT'].indexOf(event.regStatus) !== -1) {
        this.el.classList.add('disabled'); // Need to Test once
      }
      if (link) {
        this.el.setAttribute('href', link);
      }
    }
  }
}
