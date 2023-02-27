import { Component, Input, OnInit } from '@angular/core';
import { RagnarCMSDataService } from '@core/data';
import { MapCourseData } from '@core/interfaces/course-data.interface';
import { Lags } from '@core/interfaces/race-data.interface';
import { MapBoxService } from '@core/utils';
// import * as mapboxgl from 'mapbox-gl';
import { Map, NavigationControl } from 'mapbox-gl';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-course-map',
  templateUrl: './course-map.component.html',
  styleUrls: ['./course-map.component.scss'],
})
export class CourseMapComponent implements OnInit {
  @Input() mapCourseData;
  // private mapBoxConfig;
  // private initialMapConfig = {};
  // private features = [];
  public map: Map;
  totalCoordinates = [];
  coordinatesArr = [];
  private lat = 37.75;
  private lng = -122.41;

  // private tempLegs = [];
  private allMarkers = [];

  constructor(private ragnarCmsDataService: RagnarCMSDataService, private mapBoxService: MapBoxService) {}

  ngOnInit(): void {
    // Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(environment.MAP_BOX.accessToken);
    this.map = new Map({
      accessToken: environment.MAP_BOX.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11?optimize=false',
      zoom: 12,
      center: [this.lng, this.lat],
    });
    // this.map.repaint = true;
    this.map.on('load', () => {
      this.map.resize();
    });
    this.map.addControl(new NavigationControl(), 'top-left');
    this.getCourseData();
    this.ragnarCmsDataService.mapDataObserver.asObservable().subscribe((updatedData: MapCourseData) => {
      if (updatedData) {
        if (updatedData.type === 'relay' || updatedData.type === 'sprint') {
          this.mapCourseData = updatedData;
          if (updatedData.legs.length === 1) {
            this.updateRelayBoundaries();
          } else {
            this.manageRelayBoundaries();
          }
        } else if (updatedData.type === 'trail') {
          this.mapCourseData = updatedData;
          this.manageTrailBoundaries();
        }
      }
    });
  }

  getCourseData() {
    this.map.on('style.load', () => {
      if (this.mapCourseData.type === 'relay' || this.mapCourseData.type === 'sprint') {
        this.manageRelayBoundaries();
      } else if (
        this.mapCourseData.type === 'trail' ||
        this.mapCourseData.type === 'sunset' ||
        this.mapCourseData.type === 'trail_sprint'
      ) {
        this.manageTrailBoundaries();
      }
    });
  }

  manageRelayBoundaries() {
    const legsArr: Lags[] = this.mapCourseData.legs;
    // this.tempLegs = this.mapCourseData.legs;
    this.resetMarkers();
    if (legsArr) {
      const mapData = this.mapBoxService.getEventMapData(legsArr, false);
      this.map.fitBounds(mapData.bound, { padding: { top: 100, bottom: 100, left: 100, right: 100 } });
      setTimeout(() => {
        this.mapBoxService.drawMap(this.map, mapData.features, mapData.markers);
      }, 1000);
      this.allMarkers = mapData.markers;
    }
  }
  updateRelayBoundaries() {
    this.resetMarkers();
    const legsArr: Lags = this.mapCourseData.legs;
    if (legsArr) {
      const mapData = this.mapBoxService.getEventMapData(legsArr, true);
      this.map.fitBounds(mapData.bound, { padding: { top: 100, bottom: 100, left: 100, right: 100 } });
      setTimeout(() => {
        this.mapBoxService.drawMap(this.map, mapData.features, mapData.markers);
      }, 1000);
      this.allMarkers = mapData.markers;
    }
  }
  manageTrailBoundaries() {
    this.resetMarkers();
    const mapData = this.mapBoxService.getTrailEventMapData(
      this.mapCourseData.legs,
      this.mapCourseData.isBlackLoopSelected,
      this.mapCourseData.legsDistances.showBlackLoopToggle,
    );
    this.map.fitBounds(mapData.bound, { padding: { top: 100, bottom: 100, left: 100, right: 100 } });
    this.mapBoxService.drawMap(this.map, mapData.features, mapData.markers);
    this.allMarkers = mapData.markers;
  }
  resetMarkers() {
    this.allMarkers.forEach((marker) => {
      marker.remove();
    });
  }
}
