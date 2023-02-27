import { Component, Input, OnInit } from '@angular/core';
import { RagnarCMSDataService } from '@core/data';
import { MapCourseData } from '@core/interfaces/course-data.interface';

@Component({
  selector: 'app-course-elevation',
  templateUrl: './course-elevation.component.html',
  styleUrls: ['./course-elevation.component.scss'],
})
export class CourseElevationComponent implements OnInit {
  @Input() mapCourseData;
  // colors: ["orange", "yellow", "green", "black"],
  graphoptions = {
    drawPoints: false,
    width: 'auto',
    axisLineWidth: '50px',
    animatedZooms: false,
    yLabel: 'Elevation',
    xLabel: 'Miles',
    labels: [],
    series: {},
  };
  isKm = false;

  public elevationData = [];
  constructor(private ragnarCmsDataService: RagnarCMSDataService) {}

  ngOnInit(): void {
    this.getCourseData();
    this.ragnarCmsDataService.mapDataObserver.asObservable().subscribe((updatedData: MapCourseData) => {
      if (updatedData) {
        this.mapCourseData = updatedData;
        this.getCourseData();
      }
    });
  }
  getCourseData() {
    this.isKm = this.mapCourseData.distance_units === 'kilometers';

    if (this.mapCourseData.legsDistances.showBlackLoopToggle && this.mapCourseData.isBlackLoopSelected) {
      const allLegs = this.mapCourseData.legs;
      this.calculateElevation(allLegs);
    } else if (this.mapCourseData.legsDistances.showBlackLoopToggle && !this.mapCourseData.isBlackLoopSelected) {
      const allLegs = this.mapCourseData.legs.slice(0, 3);
      this.calculateElevation(allLegs);
    } else {
      const allLegs = this.mapCourseData.legs;
      this.calculateElevation(allLegs);
    }
  }
  calculateElevation(legsArr) {
    const unitRefactor = this.isKm ? 1 : 3.2808399;
    let roadMiles;
    let roadPointsLength;
    let roadFactor;
    // create array of elevation_gain & distance
    if (this.mapCourseData.type === 'relay' || this.mapCourseData.type === 'sprint') {
      this.graphoptions.labels = ['Miles', 'Elevation'];
      this.graphoptions.series = {
        Elevation: {
          color: '#F4792F',
        },
      };
      this.graphoptions.xLabel = 'Miles';
      this.graphoptions.yLabel = 'Elevation';

      this.elevationData = legsArr
        .map((m) => {
          roadMiles = this.isKm ? parseFloat(m.distance_km) : parseFloat(m.distance);
          roadPointsLength = m.points ? m.points.length : 1;
          roadFactor = (roadMiles / roadPointsLength).toFixed(3);
          return m.points;
        })
        .flat()
        .map((m, i) => [i * roadFactor, parseFloat(m.ele) * unitRefactor]);
    } else if (this.mapCourseData.type === 'trail' || this.mapCourseData.type === 'sunset' || this.mapCourseData.type === 'trail_sprint') {
      const elevationData = [];
      let pointOne;
      let pointTwo;
      let pointThree;
      let pointFour;
      let gLegPointsLength;
      let gLegMiles;
      let gLegFactor;

      this.graphoptions.labels = ['Index', 'Green Loop', 'Yellow Loop', 'Red Loop', 'Black Loop'];
      this.graphoptions.series = {
        'Green Loop': {
          color: '#9DC932',
        },
        'Yellow Loop': {
          color: '#FFCC00',
        },
        'Red Loop': {
          color: '#CB2525',
        },
        'Black Loop': {
          color: '#000000',
        },
      };

      const firstLeg = legsArr[0] ? legsArr[0].points.length : null;
      const secondLeg = legsArr[1] ? legsArr[1].points.length : null;
      const thirdLeg = legsArr[2] ? legsArr[2].points.length : null;
      const fourthLeg = legsArr[3] ? legsArr[3].points.length : null;
      const maxLegPoints = Math.max(firstLeg, secondLeg, thirdLeg, fourthLeg);

      for (let i = 0; i < legsArr.length; i++) {
        for (let pointIndex = 0; pointIndex < maxLegPoints; pointIndex++) {
          if (firstLeg !== null) {
            pointOne = legsArr[0].points[pointIndex] ? parseFloat(legsArr[0].points[pointIndex].ele) * unitRefactor : null;
          }
          if (secondLeg !== null) {
            pointTwo = legsArr[1].points[pointIndex] ? parseFloat(legsArr[1].points[pointIndex].ele) * unitRefactor : null;
          }
          if (thirdLeg !== null) {
            pointThree = legsArr[2].points[pointIndex] ? parseFloat(legsArr[2].points[pointIndex].ele) * unitRefactor : null;
          }
          if (fourthLeg !== null) {
            pointFour = legsArr[3].points[pointIndex] ? parseFloat(legsArr[3].points[pointIndex].ele) * unitRefactor : null;
          }

          if (i === 3) {
            gLegPointsLength = legsArr[3].points.length;
            gLegMiles = parseFloat(legsArr[3].distance);
            gLegFactor = (gLegMiles / gLegPointsLength).toFixed(3);

            elevationData.push([pointIndex * gLegFactor, null, null, null, pointFour]);
          } else if (i === 2) {
            gLegPointsLength = legsArr[2].points.length;
            gLegMiles = parseFloat(legsArr[2].distance);
            gLegFactor = (gLegMiles / gLegPointsLength).toFixed(3);

            elevationData.push([pointIndex * gLegFactor, null, null, pointThree, null]);
          } else if (i === 1) {
            gLegPointsLength = legsArr[1].points.length;
            gLegMiles = parseFloat(legsArr[1].distance);
            gLegFactor = (gLegMiles / gLegPointsLength).toFixed(3);

            elevationData.push([pointIndex * gLegFactor, null, pointTwo, null, null]);
          } else if (i === 0) {
            gLegPointsLength = legsArr[0].points.length;
            gLegMiles = parseFloat(legsArr[0].distance);
            gLegFactor = (gLegMiles / gLegPointsLength).toFixed(3);

            elevationData.push([pointIndex * gLegFactor, pointOne, null, null, null]);
          }
        }
      }
      this.elevationData = elevationData;
    }
  }
}
