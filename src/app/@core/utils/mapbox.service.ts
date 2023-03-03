import { Injectable } from '@angular/core';
import { MobileDetectionService } from './mobile-detect.service';
// import * as mapboxgl from 'mapbox-gl';
import { Map, LngLatBounds, Marker, LngLat } from 'mapbox-gl';
import { EventData, MapEventsData } from '@core/interfaces/map-events.interface';
import { FetchRaceList } from '@core/interfaces/gql-data.interface';
/* TODO: Refactoring Required Regressly */
@Injectable()
export class MapBoxService {
  // private isFunctionProcessedOneFilter = false;
  // private filteredData = [];
  // private cachedFilteredData = [];
  // private isDateProcessedOnce = false;
  constructor(private MobileDetectionService: MobileDetectionService) {}

  getMapBoxConfig(maps: Map, event?: EventData, key?: string, center?: { latitude: number; longitude: number }) {
    const config = { center: { latitude: 38, longitude: -98 }, zoom: 3 };
    let zoom = this.MobileDetectionService.isAnyMobile() ? 8 : 9;
    let configs = {};
    if (key) {
      zoom = event.type === 'trail' || event.type === 'sunset' || event.type === 'trail_sprint' ? 14 : zoom;
      center = center || {
        latitude: event.lat,
        longitude: event.lng,
      };
      configs = configs[key](maps, center, zoom);
    }
    return config;
  }

  createMarker(event) {
    return {
      eventData: {
        id: event.id,
        alias: event.alias,
        type: event.type,
        registrationUrl: 'http://' + event.registration_url,
        percentageFull: event.percentageFull,
        name: event.name,
        startCity: event.start_city,
        endCity: event.end_city,
        startDate: event.start_date,
        endDate: event.end_date,
        regStatus: event.regStatus,
        regStatusLabel: event.regStatusLabel,
        waitlist_id: event.waitlist_id,
        waitlist_url: event.waitlist_url,
        prelaunch_flag: event.prelaunch_flag,
        prelaunch_url: event.prelaunch_url,
        bg: event.bg,
        lat: event.lat,
        lng: event.lng,
        coming_soon: event.coming_soon,
        tile: event.files.tile,
      },
      windowOptions: { boxClass: 'infobox' },
      id: event.id,
      latitude: event.lat,
      longitude: event.lng,
      templateUrl: 'partials/map/includes/info-window.html',
      icon: 'images/map-overview/location-icon.png',
    };
  }

  getEventMarkers(events: FetchRaceList[]): MapEventsData[] {
    const markers = [];
    events.map((event) => {
      if (event.lat && event.lng) {
        markers.push(this.createMarker(event));
      }
    });
    return markers;
  }

  drawMap(mapBox: Map, features, markers) {
    try {
      if (mapBox.getLayer('mapLine')) {
        mapBox.removeLayer('mapLine');
        mapBox.removeSource('mapLine');
      }
    } catch (err) {}

    markers.forEach((marker) => {
      marker.addTo(mapBox);
    });

    mapBox.addLayer({
      id: 'mapLine',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      },
      paint: { 'line-width': 4, 'line-color': ['get', 'color'] },
    });
  }

  getEventMapData(legs, isLegSelected) {
    const setLegColor = (index: number) => {
      return index % 2 === 0 ? '#FFCC33' : '#F4792F';
    };

    const bound = new LngLatBounds();
    const features = [];
    const markers = [];

    legs.forEach((leg, i) => {
      const startPoint = leg.points[0];
      const endPoint = leg.points[leg.points.length - 1];
      const middlePoint = leg.points[Math.floor(leg.points.length / 2)];

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.width = '45px';
      el.style.height = '75px';

      if (i === 0) {
        const startEl = el;
        startEl.style.backgroundImage = 'url(/assets/images/event-detail/course/start-flag.png)';
        markers.push(new Marker(startEl).setLngLat([startPoint.lon * 1, startPoint.lat * 1]));
      }
      if (i === legs.length - 1) {
        const endEl = el;
        endEl.style.backgroundImage = 'url(/assets/images/event-detail/course/finish-flag.png)';
        markers.push(new Marker(endEl).setLngLat([endPoint.lon * 1, endPoint.lat * 1]));
      }
      if (leg.ragnar_leg === true && !isLegSelected) {
        const bannerEl = el;
        bannerEl.style.backgroundImage = 'url(/assets/images/event-detail/course/ragnar-leg-icon-new.png)';
        markers.push(new Marker(bannerEl).setLngLat([startPoint.lon * 1, startPoint.lat * 1]));
      }

      if (isLegSelected) {
        const legEL = document.createElement('div');
        legEL.className = 'marker';
        legEL.style.backgroundImage =
          'url(http://chart.apis.google.com/chart?cht=it&chs=25x25&chco=F4792F,000000ff,ffffff01&chl=' +
          leg.leg_number +
          '&chx=FFFFFF,0&chf=bg,s,00000000&ext=.png)';
        legEL.style.backgroundRepeat = 'no-repeat';
        legEL.style.width = '35px';
        legEL.style.height = '35px';
        markers.push(new Marker(legEL).setLngLat([middlePoint.lon * 1, middlePoint.lat * 1]));
      }

      const coordinates = [];
      leg.points.forEach((point) => {
        const latlng = new LngLat(point.lon, point.lat);
        bound.extend(latlng);
        coordinates.push([point.lon * 1, point.lat * 1]);
      });
      features.push({
        type: 'Feature',
        properties: { color: leg.ragnar_leg === '1' ? '#C42033' : setLegColor(i) },
        geometry: {
          type: 'LineString',
          coordinates,
        },
      });
    });

    return {
      bound,
      features,
      markers,
    };
  }

  getTrailEventMapData(legs, isBlackLoop, showBlackLoopToggle) {
    const colorArr = { green: '#99cc33', yellow: '#ffcc00', red: '#cc0000', black: '#000000' };

    const bound = new LngLatBounds();
    const features = [];
    const markers = [];

    legs.forEach((leg, i) => {
      if (!isBlackLoop && leg.blackloop && leg.blackloop !== '0') {
        return;
      }
      isBlackLoop = showBlackLoopToggle ? isBlackLoop : true;

      const startPoint = leg.points[0];
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.width = '15px';
      el.style.height = '15px';

      if (i === legs.length - (isBlackLoop ? 1 : 2)) {
        el.style.backgroundImage =
          'url(http://chart.apis.google.com/chart?cht=itr&chs=10x10&chco=FF0000,000000ff,ffffff01&chx=FFFFFF,0&chf=bg,s,00000000&ext=.png)';
        markers.push(new Marker(el).setLngLat([startPoint.lon, startPoint.lat]));
      }

      const coordinates = [];
      leg.points.forEach((point) => {
        const latlng = new LngLat(point.lon, point.lat);
        bound.extend(latlng);
        coordinates.push([point.lon * 1, point.lat * 1]);
      });

      features.push({
        type: 'Feature',
        properties: { color: colorArr[leg.color] },
        geometry: {
          type: 'LineString',
          coordinates,
        },
      });
    });

    return {
      bound,
      features,
      markers,
    };
  }
}
