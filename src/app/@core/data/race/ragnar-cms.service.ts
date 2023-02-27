import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { fetchRaceList, fetchRaceData, fetchRaceUpdates, getAllSponsors, SponsorBySlug } from '../../graphql/graphql';
import { MapCourseData, MapCourseDataClass } from '../../interfaces/course-data.interface';
import { Races, Sponsors, Sponsor } from '../../interfaces/gql-data.interface';
import { OverviewRaceDataClass } from '../../interfaces/race-data.interface';
import { MeetupCalenderList } from '../../interfaces/static-pages.interface';
import { TeamCenterRace } from '../../interfaces/team-center-data.interface';
import { RACE_CONFIG } from '../../utils';

@Injectable()
export class RagnarCMSDataService {
  public mapDataObserver: BehaviorSubject<MapCourseData> = new BehaviorSubject<MapCourseData>(null);
  public tableDataObserver: BehaviorSubject<MapCourseData> = new BehaviorSubject<MapCourseData>(null);
  private cacheData = {
    races: null,
    raceData: null,
    raceMapData: null,
    raceCourseData: null,
  };

  constructor(private http: HttpClient) {}

  getRaces() {
    /* TODO: Need to integrate new service for caching data*/
    if (this.cacheData.races) {
      return new BehaviorSubject<Races>(this.cacheData.races);
    } else {
      return this.fetchRaces();
    }
  }

  fetchRaces() {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    return this.http.post<Races>(url, fetchRaceList).pipe(
      map(
        (races) => {
          races.data.fetchRaceList.forEach((race) => {
            // TODO: Need to set below menuURL for races after deploy on runragnar.com
            if (race.country !== 'USA') {
              race.menuUrl = RACE_CONFIG.linkPrefixs[race.country]
                ? `${environment.DOMESTIC_URL}${RACE_CONFIG.linkPrefixs[race.country]}${race.type}/${race.alias}#overview`
                : null;
            } else {
              race.menuUrl = `event-detail/${race.type}/${race.alias}`;
            }
            
            race.aliasName = race.name
              .replace('Reebok', '')
              .replace('Ragnar', '')
              .replace('Trail', '')
              .replace('Road', '')
              .replace('Sunset', '')
              .replace('Sprint', '')
              .trim();
          });
          this.cacheData.races = races;
          return this.cacheData.races;
        },
        (error) => {
          return error;
        },
      ),
    );
  }

  getRaceData(id: string, fields) {
    if (this.cacheData.raceData && id === this.cacheData.raceData.alias) {
      return new BehaviorSubject<OverviewRaceDataClass>(this.cacheData.raceData);
    } else {
      return this.fetchRaceData(id, fields);
    }
  }

  fetchRaceData(id: string, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    return this.http.post<OverviewRaceDataClass>(url, fetchRaceData(id, fields)).pipe(
      map(
        (response) => {
          const eventData = response.data.fetchRaceByIdOrSlug;
          if (response) {
            if (response.data.fetchRaceByIdOrSlug.pricing) {
              // const eventDataPricing = response.data.fetchRaceByIdOrSlug.pricing;
              /*
              let pricing;
              if (eventData.id === '107' || eventData.id === '104') {
                pricing = { regular: [], ultra: [], six_pack: [] };
              } else {
                pricing = { regular: [], six_pack: [], ultra: [], high_school: [], black_loop: [] };
              }
              const now = moment().startOf('day');
              eventDataPricing.forEach((pricingData) => {
                const stageData = {
                  label: '',
                  isInactive: false,
                  isComing: false,
                  isActive: false,
                  teamPrice: '',
                  startDate: '',
                  endDate: '',
                };
                keyName = pricingData.name.toLowerCase().replace('-', '_').replace(' ', '_');
                // pricingData.teamPrice = '$' + Math.round(parseInt(pricingData.teamPrice, 10));
                if (typeof pricing[keyName] === 'undefined') {
                  pricing[keyName] = [];
                }
                if (eventData.id === '107' && pricingData.name === 'Six-Pack') {
                  pricing[keyName].regType = '5-Pack';
                } else {
                  pricing[keyName].regType = pricingData.name;
                }
                const start = moment(pricingData.startDate, 'YYYY-MM-DD');
                const end = moment(pricingData.endDate, 'YYYY-MM-DD');
                now > end ? (pricingData.isInactive = true) : (pricingData.isComing = pricingData.isActive ? false : true);

                if (start <= now && now <= end) {
                  pricing[keyName].teamSize = pricingData.teamSize;
                  pricing[keyName].teamPrice = pricingData.teamPrice;
                  pricing[keyName].description = pricingData.description;
                  pricingData.isActive = true;
                  pricingData.isComing = false;
                }
                if (pricingData.label === 'Late') {
                  pricingData.label = 'Last Chance';
                }
                if (pricingData.label === 'Close') {
                  pricingData.label = 'Closed';
                }
                if (typeof pricing[keyName].stages === 'undefined') {
                  pricing[keyName].stages = [];
                }
                stageData.label = pricingData.label;
                stageData.isInactive = pricingData.isInactive;
                stageData.isComing = pricingData.isComing;
                stageData.isActive = pricingData.isActive;
                stageData.teamPrice = pricingData.teamPrice;
                stageData.startDate = pricingData.startDate;
                stageData.endDate = pricingData.endDate;

                pricing[keyName].stages.push(stageData);
              });
              Object.keys(pricing).forEach((stage) => {
                if (typeof pricing[stage].regType !== 'undefined') {
                  const stageData = {
                    label: '',
                    isInactive: false,
                    isComing: false,
                    isActive: false,
                    teamPrice: '',
                    startDate: '',
                    endDate: '',
                  };
                  const regCloseDate = eventData.registration_closes;
                  stageData.label = 'Closes';
                  stageData.teamPrice = 'Closes';
                  stageData.startDate = regCloseDate;
                  stageData.endDate = regCloseDate;
                  const start = moment(regCloseDate, 'YYYY-MM-DD');
                  now > start ? (stageData.isActive = true) : (stageData.isComing = true);
                  pricing[stage].stages.push(stageData);
                }
              });
              */
              // eventData.updatedPricing = Object.keys(pricing).length ? pricing : undefined;
              eventData.updatedPricing = this.formatPricing(eventData);
              Object.keys(eventData.updatedPricing).forEach((pricingKey) => {
                eventData.updatedPricing[pricingKey].stages.forEach((stage) => {
                  if (stage.isActive) {
                    eventData.updatedPricing[pricingKey].teamPrice = stage.teamPrice;
                  }
                });
              });
            }
          }
          this.cacheData.raceData = eventData;
          return this.cacheData.raceData;
        },
        (error) => {
          return error;
        },
      ),
    );
  }
  getTeamCenterRaceDataWithGql(id: string, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    return this.http.post<TeamCenterRace>(url, fetchRaceData(id, fields)).pipe(
      map((response) => {
        return response && response.data && response.data.fetchRaceByIdOrSlug ? response.data.fetchRaceByIdOrSlug : [];
      }),
    );
  }

  getRaceMapData(id: string | number, fields) {
    if (this.cacheData.raceMapData && id === this.cacheData.raceMapData.id) {
      return new BehaviorSubject<OverviewRaceDataClass>(this.cacheData.raceMapData);
    } else {
      return this.fetchRaceMapData(id, fields);
    }
  }

  fetchRaceMapData(id: string | number, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    return this.http.post<OverviewRaceDataClass>(url, fetchRaceData(id, fields)).pipe(
      map((response) => {
        this.cacheData.raceMapData =
          response && response.data && response.data.fetchRaceByIdOrSlug ? response.data.fetchRaceByIdOrSlug : [];
        return this.cacheData.raceMapData;
      }),
    );
  }

  getRaceCourseData(id: string, fields) {
    if (this.cacheData.raceCourseData && id === this.cacheData.raceCourseData.alias) {
      return new BehaviorSubject<MapCourseDataClass>(this.cacheData.raceCourseData);
    } else {
      return this.fetchRaceCourseData(id, fields);
    }
  }

  fetchRaceCourseData(id: string, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    return this.http.post<MapCourseDataClass>(url, fetchRaceData(id, fields)).pipe(
      map(
        (response) => {
          this.cacheData.raceCourseData =
            response && response.data && response.data.fetchRaceByIdOrSlug ? response.data.fetchRaceByIdOrSlug : [];
          return this.cacheData.raceCourseData;
        },
        (error) => {
          return error;
        },
      ),
    );
  }
  getRaceUpdatesWithGql(id: string, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    // tslint:disable-next-line: no-any
    return this.http.post<any>(url, fetchRaceUpdates(id, fields)).pipe(
      map(
        (response) => {
          return response && response.data && response.data.getRaceUpdates ? response.data.getRaceUpdates : [];
        },
        (error) => {
          return error;
        },
      ),
    );
  }

  getPlanYourTripDataWithGql(id: string, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);
    // tslint:disable-next-line: no-any
    return this.http.post<any>(url, fetchRaceData(id, fields)).pipe(
      map(
        (response) => {
          return response && response.data && response.data.fetchRaceByIdOrSlug ? response.data.fetchRaceByIdOrSlug : [];
        },
        (error) => {
          return error;
        },
      ),
    );
  }

  getCalendarList() {
    let url = `${environment.CMS_API}/api/meetup_calendar/list`;
    url = encodeURI(url);

    return this.http.get<MeetupCalenderList[]>(url).pipe(
      map(
        (calendarData) => {
          return calendarData || [];
        },
        (error) => {
          return error;
        },
      ),
    );
  }

  /*   getRaceById(id) {
    let url = `${environment.CMS_API}/api/race/get/${id}?version=1`;
    url = encodeURI(url);
    return this.http.get<any>(url).pipe(
      map(
        (race) => {
          if (RACE_CONFIG.linkPrefixs[race.data.country]) {
            if (RACE_CONFIG.linkPrefixs[race.data.country] === '/event-detail/') {
              race.data.menuUrl = `${environment.DOMESTIC_URL}${RACE_CONFIG.linkPrefixs[race.data.country]}${race.data.type}/${
                race.data.alias
              }#overview`;
            } else {
              race.data.menuUrl = `${environment.DOMESTIC_URL}${RACE_CONFIG.linkPrefixs[race.data.country]}${race.data.type}/${
                race.data.alias
              }#overview`;
            }
          } else {
            race.data.menuUrl = null;
          }
          race.data.aliasName = race.data.name
            .replace('Reebok', '')
            .replace('Ragnar', '')
            .replace('Trail', '')
            .replace('Road', '')
            .replace('Sunset', '')
            .replace('Sprint', '')
            .trim();
          return race;
        },
        (error) => {
          return error;
        },
      ),
    );
  } */
  resetTableData(courseData: MapCourseData) {
    this.tableDataObserver.next(courseData);
  }
  resetMapData(updatedData) {
    this.mapDataObserver.next(updatedData);
  }
  formatPricing(data) {
    const now = moment().startOf('day');
    let start;
    let end;
    let closeStart;

    const finalData = data.pricing.reduce((accu, curr) => {
      const cname = curr.name.toUpperCase().replace(' ', '_');
      accu[cname] = {
        regType: curr.name,
        teamPrice: curr.teamPrice,
        teamSize: curr.teamSize,
        stages: ((accu[cname] || {}).stages || []).concat(curr),
      };
      return accu;
    }, {});

    Object.keys(finalData).forEach((element) => {
      finalData[element].stages.forEach((e) => {
        start = moment(e.startDate, 'YYYY-MM-DD');
        end = moment(e.endDate, 'YYYY-MM-DD');
        closeStart = moment(data.registration_closes, 'YYYY-MM-DD');
        // now > end ? (e.isInactive = true) : (e.isComing = e.isActive ? false : true);
        e.isActive = false;
        e.isComing = false;
        e.isInactive = false;

        if (start <= now && now <= end) {
          e.isActive = true;
          e.isComing = false;
        } else {
          e.isActive = undefined;
          e.isComing = undefined;
        }
        if (now > end) {
          e.isInactive = true;
        } else {
          e.isComing = e.isActive ? false : true;
        }
        return e;
      });
      // data.registration_closes
      // now > start ? (stageData.isActive = true) : (stageData.isComing = true);
      finalData[element].stages.push({
        label: 'Closes',
        teamPrice: 'Closes',
        startDate: data.registration_closes,
        endDate: data.registration_closes,
        isActive: now > closeStart === true,
        isComing: now > closeStart === false,
      });
    });
    return finalData;
  }

  getAllSponsors() {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);

    return this.http.post<Sponsors>(url, getAllSponsors);
  }

  getSponsorBySlug(slug: string, fields) {
    let url = `${environment.CMS_API}/graphql`;
    url = encodeURI(url);

    return this.http.post<Sponsor>(url, SponsorBySlug(slug, fields)).pipe(
      map(
        (response) => {
          return response && response.data && response.data.getSponsorBySlug ? response.data.getSponsorBySlug : [];
        },
        (error) => {
          return error;
        },
      ),
    );
  }
}
