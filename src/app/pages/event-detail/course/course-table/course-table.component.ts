import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoModalComponent } from '@core/modal/video-modal/video-modal.component';
import * as moment from 'moment';
import { MapCourseData } from '@core/interfaces/course-data.interface';
import { RagnarCMSDataService } from '@core/data/race/ragnar-cms.service';
import { SelectedLegDetailsComponent } from '@pages/event-detail/dialog/selected-leg-details/selected-leg-details.component';

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.scss'],
})
export class CourseTableComponent implements OnInit {
  @Input() courseData: MapCourseData;
  @Output() selectLegData = new EventEmitter();
  @Output() selectBlackLoop = new EventEmitter();

  public isKm = true;
  public legsDividerArray = [];
  public selectedLeg = {};
  public selectedLegNumber = 0;
  public isBlackLoopSelected = false;
  isLegSelected = false;
  trailDetails = [];
  constructor(private modalService: NgbModal, private ragnarCmsDataService: RagnarCMSDataService) {}
  ngOnInit(): void {
    // this.courseData = this.courseData ? this.courseData : {};
    let startDateObj: moment.Moment;
    startDateObj = moment(this.courseData.start_date, 'YYYY-MM-DD');
    this.courseData.showPdf =
      this.courseData.type === 'trail' || this.courseData.type === 'sunset' || this.courseData.type === 'trail_sprint'
        ? true
        : startDateObj.year() < 2019;

    this.isKm = this.courseData.distance_units === 'kilometers';
    if (this.courseData.type === 'relay' || this.courseData.type === 'sprint') {
      this.generateRelayTable();
    } else {
      this.generateTrailTable();
    }

    this.ragnarCmsDataService.tableDataObserver.asObservable().subscribe((updatedData: MapCourseData) => {
      if (updatedData && updatedData.legs.length > 1) {
        this.courseData = updatedData;
        startDateObj = moment(this.courseData.start_date, 'YYYY-MM-DD');
        this.courseData.showPdf =
          this.courseData.type === 'trail' || this.courseData.type === 'sunset' || this.courseData.type === 'trail_sprint'
            ? true
            : startDateObj.year() < 2019;

        this.isKm = this.courseData.distance_units === 'kilometers';
        if (this.courseData.type === 'relay' || this.courseData.type === 'sprint') {
          this.generateRelayTable();
        } else {
          this.generateTrailTable();
        }
      }
    });
  }
  generateRelayTable() {
    const divider = this.courseData.legs.length !== 12 ? 3 : 2;
    const loopIndex = this.courseData.legs.length / divider;
    const legsDividerArray = [];
    this.courseData.legs.forEach((leg) => {
      leg.distance_km = leg.distance_km;
      leg.distance = leg.distance;
    });
    for (let j = 0; j < loopIndex; j++) {
      legsDividerArray[j] = [];
      for (let i = 1; i <= divider; i++) {
        if (i === 1) {
          legsDividerArray[j].push(this.courseData.legs[j]);
        } else if (i === 2) {
          legsDividerArray[j].push(this.courseData.legs[j + loopIndex]);
        } else {
          legsDividerArray[j].push(this.courseData.legs[j + loopIndex + loopIndex]);
        }
      }
    }
    this.legsDividerArray = legsDividerArray;
  }
  generateTrailTable() {
    this.trailDetails = [
      [
        { seq: 1, class: 'circle-base green' },
        { seq: 9, class: 'diamond red' },
        { seq: 17, class: 'square yellow' },
      ],
      [
        { seq: 2, class: 'square yellow' },
        { seq: 10, class: 'circle-base green' },
        { seq: 18, class: 'diamond red' },
      ],
      [
        { seq: 3, class: 'diamond red' },
        { seq: 11, class: 'square yellow' },
        { seq: 19, class: 'circle-base green' },
      ],
      [
        { seq: 4, class: 'circle-base green' },
        { seq: 12, class: 'diamond red' },
        { seq: 20, class: 'square yellow' },
      ],
      [
        { seq: 5, class: 'square yellow' },
        { seq: 13, class: 'circle-base green' },
        { seq: 21, class: 'diamond red' },
      ],
      [
        { seq: 6, class: 'diamond red' },
        { seq: 14, class: 'square yellow' },
        { seq: 22, class: 'circle-base green' },
      ],
      [
        { seq: 7, class: 'circle-base green' },
        { seq: 15, class: 'diamond red' },
        { seq: 23, class: 'square yellow' },
      ],
      [
        { seq: 8, class: 'square yellow' },
        { seq: 16, class: 'circle-base green' },
        { seq: 24, class: 'diamond red' },
      ],
    ];
  }
  selectLeg(leg) {
    this.isLegSelected = true;
    this.selectedLeg = leg;
    this.selectedLegNumber = leg.leg_number;
    this.selectLegData.next({ selectedLeg: leg });
  }
  seeFullCourse() {
    this.selectedLegNumber = 0;
    this.isLegSelected = false;
    this.selectLegData.next({ allData: 'allData' });
  }
  blackLoopToogle(event) {
    this.isBlackLoopSelected = event.target.checked;
    this.selectBlackLoop.emit({ blackloopSelected: this.isBlackLoopSelected });
  }
  openBlackLoopPopup() {
    const modalRef = this.modalService.open(VideoModalComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
    });
    modalRef.componentInstance.videoLink = 'https://player.vimeo.com/video/322327130';
  }
  seeLegDetails(legData) {
    const modalRef = this.modalService.open(SelectedLegDetailsComponent, {
      scrollable: true,
      centered: true,
      keyboard: true,
    });
    modalRef.componentInstance.selectedLegData = legData;
  }
}
