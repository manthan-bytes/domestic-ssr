import { Component, OnInit, ViewChild } from '@angular/core';
import { NewVisitorService, RagnarCMSDataService } from '@core/data';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
// import * as _ from 'lodash';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { google, outlook, office365, yahoo, ics } from 'calendar-link';
import { MeetupCalenderList } from '@core/interfaces/static-pages.interface';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-meetup',
  templateUrl: './meetup.component.html',
  styleUrls: ['./meetup.component.scss'],
})
export class MeetupComponent implements OnInit {
  @ViewChild('instanceL', { static: true }) instOfLocation: NgbTypeahead;
  @ViewChild('instanceR', { static: true }) instOfRaceName: NgbTypeahead;

  focusOfLocation = new Subject<string>();
  clickOfLocation = new Subject<string>();
  focusOfRace = new Subject<string>();
  clickOfRace = new Subject<string>();

  public filterData = {
    location: null,
    race: null,
    date: null,
  };

  public calendarList = {
    listData: [],
    raceName: [],
  };

  public location = [];
  public showCalendarFlag = false;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  public addCalendarList = [
    {
      label: 'iCalendar',
      value: 'ics',
    },
    {
      label: 'Google Calendar',
      value: 'google',
    },
    {
      label: 'Outlook',
      value: 'outlook',
    },
    {
      label: 'Yahoo! Calendar',
      value: 'yahoo',
    },
    {
      label: 'Microsoft Calendar',
      value: 'office365',
    },
  ];

  locationList(text: Observable<string>) {
    const debouncedText = text.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus = this.focusOfLocation;
    return merge(debouncedText, inputFocus).pipe(
      map((term) =>
        term === '' ? this.location : this.location.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
  }

  raceList(text: Observable<string>) {
    const debouncedText = text.pipe(debounceTime(200), distinctUntilChanged());
    const inputFocus = this.focusOfRace;
    return merge(debouncedText, inputFocus).pipe(
      map((term) => {
        return term === ''
          ? this.calendarList.raceName
          : this.calendarList.raceName.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
      }),
    );
  }
  constructor(
    private ragnarCmsDataService: RagnarCMSDataService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private dataLayerService: DataLayerService,
    private newVisitorService: NewVisitorService,
  ) {
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    this.newVisitorService.popUp();
    this.dataLayerService.pageInitEvent({
      screen_name: 'meetup',
      pagePostType: 'meetup',
      pagePostType2: 'single-page',
    });
    this.getCalendarList();
  }

  getCalendarList() {
    this.ragnarCmsDataService.getCalendarList().subscribe((response: MeetupCalenderList[]) => {
      response.forEach((item) => {
        item.dateCalendarStart = this.getRaceCalendarDate(item.date + ' ' + item.start_time);
        item.dateCalendarEnd = this.getRaceCalendarDate(item.date + ' ' + item.end_time);
        this.location.push(`${item.city} - ${item.state} - ${item.zip}`);
        this.calendarList.raceName = [...this.calendarList.raceName, ...item.name.split(',')];
      });
      this.calendarList.listData = response;
      this.calendarList.raceName = [...new Set(this.calendarList.raceName)];
    }, this.handelError);
  }

  getRaceCalendarDate(raceDate) {
    const newDate = new Date(raceDate);
    const sMonth = this.padValue(newDate.getMonth() + 1);
    const sDay = this.padValue(newDate.getDate());
    const sYear = newDate.getFullYear();
    let sHour: number | string = newDate.getHours();
    const sMinute = this.padValue(newDate.getMinutes());
    let sAMPM = 'AM';

    /* type mismatch */
    // const iHourCheck = parseInt(sHour);

    if (sHour > 12) {
      sAMPM = 'PM';
      sHour = sHour - 12;
    } else if (sHour === 0) {
      sHour = '12';
    }

    sHour = this.padValue(sHour);

    return sMonth + '/' + sDay + '/' + sYear + ' ' + sHour + ':' + sMinute + ' ' + sAMPM;
  }

  padValue(sHour) {
    return sHour < 10 ? '0' + sHour : sHour;
  }

  getRaceDate(raceDate) {
    const date = new Date(raceDate);
    const month = date.getMonth();

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
    return date.getDate() + ' ' + months[month];
  }

  getRaceDay(raceDate) {
    const date = new Date(raceDate);
    const weekday = date.getDay();

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[weekday];
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.showCalendarFlag = false;
      this.filterData.date = `${moment(`${this.fromDate.month}-${this.fromDate.day}-${this.fromDate.year}`).format('MM/DD/YYYY')}-${moment(
        `${this.toDate.month}-${this.toDate.day}-${this.toDate.year}`,
      ).format('MM/DD/YYYY')}`;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  showCalendar() {
    this.showCalendarFlag = this.showCalendarFlag ? false : true;
  }

  addEventToCalendar(value, race) {
    const event = {
      title: race.title,
      description: race.description,
      start: race.dateCalendarStart,
      end: race.dateCalendarEnd,
      location: `${race.location} ${race.address_1} ${race.city} ${race.state} ${race.zip}`,
    };
    switch (value) {
      case 'ics':
        window.open(ics(event), '_blank');
        break;
      case 'google':
        window.open(google(event), '_blank');
        break;
      case 'outlook':
        window.open(outlook(event), '_blank');
        break;
      case 'yahoo':
        window.open(yahoo(event), '_blank');
        break;
      case 'office365':
        window.open(office365(event), '_blank');
        break;
      default:
        break;
    }
  }

  private handelError(err) {
    console.error(err);
  }
}
