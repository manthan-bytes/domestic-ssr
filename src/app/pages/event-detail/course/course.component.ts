import { Component, OnInit } from '@angular/core';
import { RagnarCMSDataService } from '@core/data';
import { courseDataField } from '@core/graphql/graphql';
import { Lags } from '@core/interfaces/race-data.interface';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '@core/utils/event/event.service';
import cloneDeep from 'lodash/cloneDeep';
import { MapCourseData } from '@core/interfaces/course-data.interface';
import { TinySliderService } from '@core/utils/tiny-slider.service';
import { DataLayerService } from '@core/utils';

@Component({
  selector: 'app-event-detail-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  public courseData: MapCourseData;
  public mapCourseData: MapCourseData;
  public selectedLeg: Lags;
  showMap = true;
  isKm = false;
  isAnyLegSelected = false;
  totalTrailDistance = 0;
  isBlackLoopSelected = false;
  loadingGlobal = false;
  activeSection = 'mapElevation';

  constructor(
    private ragnarCmsDataService: RagnarCMSDataService,
    private route: ActivatedRoute,
    private slider: TinySliderService,
    private eventService: EventService,
    private dataLayerService: DataLayerService,
  ) {}

  ngOnInit(): void {
    this.getCourseData();
  }

  tinySliderIntialize() {
    setTimeout(() => {
      const tns = this.slider.nativeSlider;
      tns({
        container: '#tiny-slider',
        items: 3,
        // slideBy: 'page',
        center: true,
        controls: true,
        gutter: 10,
        mouseDrag: true,
        autoplayButtonOutput: false,
        autoplay: true,
        nav: false,
        autoWidth: true,
        arrowKeys: false,
        loop: true,
        responsive: {
          0: {
            items: 1,
            autoHeight: true,
            nav: false,
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
    });
  }

  getCourseData() {
    this.route.url.subscribe((urlSegments) => {
      this.loadingGlobal = true;
      this.ragnarCmsDataService
        .getRaceCourseData(urlSegments && (urlSegments[1] || {}).path, courseDataField)
        .subscribe((response: MapCourseData) => {
          this.loadingGlobal = false;
          this.courseData = {
            ...response,
            legsDistances: this.eventService.parseLegsDistances(response),
          };
          this.mapCourseData = cloneDeep(this.courseData);
          this.isKm = this.mapCourseData.distance_units === 'kilometers';
          this.selectedLeg = this.mapCourseData.legs[0];
          if (this.mapCourseData.type === 'trail') {
            const allLegs = this.mapCourseData.legs;
            if (allLegs[allLegs.length - 1].name === 'Black Loop') {
              this.calculateTotalTrailDistance(allLegs.slice(0, 3));
            } else {
              this.calculateTotalTrailDistance(this.courseData.legs);
            }
          } else if (this.courseData.type === 'sunset') {
            this.calculateTotalTrailDistance(this.courseData.legs);
          }
          this.ragnarCmsDataService.resetTableData(this.mapCourseData);

          /* Intialize */

          this.tinySliderIntialize();
        }, this.handleError);
    }, this.handleError);
  }
  selectLegData(event) {
    if (event.selectedLeg) {
      this.isAnyLegSelected = true;
      this.selectedLeg = event.selectedLeg;
      this.mapCourseData.legs = [];
      this.mapCourseData.legs.push(event.selectedLeg);
      this.ragnarCmsDataService.resetMapData(this.mapCourseData);
    } else if (event.allData) {
      this.isAnyLegSelected = false;
      this.selectedLeg = null;
      this.mapCourseData = null;
      this.route.url.subscribe((urlSegments) => {
        this.ragnarCmsDataService
          .getRaceCourseData(urlSegments && (urlSegments[1] || {}).path, courseDataField)
          .subscribe((response: MapCourseData) => {
            this.mapCourseData = {
              ...response,
              legsDistances: this.eventService.parseLegsDistances(response),
            };
            this.ragnarCmsDataService.resetMapData(this.mapCourseData);
          }, this.handleError);
      }, this.handleError);
    }
  }
  selectBlackLoop(event) {
    this.isBlackLoopSelected = event.blackloopSelected;
    this.selectedLeg = this.mapCourseData.legs[0];
    if (event.blackloopSelected) {
      this.totalTrailDistance = 0;
      this.calculateTotalTrailDistance(this.courseData.legs);
      this.mapCourseData = this.courseData;
      this.mapCourseData.isBlackLoopSelected = event.blackloopSelected;
      this.ragnarCmsDataService.resetMapData(this.mapCourseData);
    } else {
      this.totalTrailDistance = 0;
      const allLegs = cloneDeep(this.courseData.legs);
      this.calculateTotalTrailDistance(allLegs.slice(0, 3));
      this.mapCourseData.isBlackLoopSelected = event.blackloopSelected;
      this.ragnarCmsDataService.resetMapData(this.mapCourseData);
    }
  }

  private handleError(err) {
    this.loadingGlobal = false;
    console.error(err);
  }
  calculateTotalTrailDistance(legs: Lags[]) {
    legs.forEach((leg) => {
      this.totalTrailDistance += this.isKm ? leg.distance_km : leg.distance;
    });
  }
  selectTrailLeg(legNumber) {
    this.selectedLeg = this.courseData.legs[legNumber - 1];
  }
  selectSunsetLegDifficulty(legNumber) {
    this.selectedLeg = this.courseData.legs[legNumber - 1];
  }
  scroll(htmlId: string) {
    this.activeSection = htmlId;
    const el: HTMLElement = document.getElementById(htmlId);
    el.scrollIntoView({ behavior: 'smooth' });
  }
  isObject(data) {
    if (typeof data === 'string') {
      return false;
    } else {
      return true;
    }
  }
}
