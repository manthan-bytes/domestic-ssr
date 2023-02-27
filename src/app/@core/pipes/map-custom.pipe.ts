import { Pipe, PipeTransform } from '@angular/core';
import loadashMap from 'lodash/map';
import loadashFilter from 'lodash/filter';
import { FetchRaceList } from '../interfaces/gql-data.interface';

@Pipe({
  name: 'mapCustom',
})
export class MapCustomPipe implements PipeTransform {
  transform(data, filterObj): FetchRaceList[] {
    let isFunctionProcessedOneFilter = false;
    let filteredData = [];
    let cachedFilteredData = [];
    let isDateProcessedOnce = false;

    if (filterObj.length > 0) {
      filterObj.forEach((filter) => {
        if (filter.type === 'type' || filter.type === 'location' || filter.type === 'sub-region' || filter.type === 'sub-raceType') {
          if (isFunctionProcessedOneFilter) {
            cachedFilteredData = filteredData;
            filteredData = [];
            cachedFilteredData.forEach((item) => {
              if (filter.value === item.type || filter.value === item.region || filter.value === item.subregion) {
                filteredData.push(item);
              } else if (filter.value === 'black loop' && item.blackloop_flag === 1) {
                filteredData.push(item);
              }
            });
          } else {
            data.forEach((item) => {
              if (filter.value === item.type || filter.value === item.region || filter.value === item.subregion) {
                filteredData.push(item);
              } else if (filter.value === 'black loop' && item.blackloop_flag === 1) {
                filteredData.push(item);
              }
            });
          }
        } else if (filter.type === 'Dates') {
          if (!isDateProcessedOnce) {
            const getMonth = loadashMap(loadashFilter(filterObj, { type: 'Dates' }), 'value');
            if (isFunctionProcessedOneFilter) {
              cachedFilteredData = filteredData;
              filteredData = [];
              cachedFilteredData.forEach((item) => {
                if (getMonth.indexOf(new Date(item.start_date).getMonth().toString()) >= 0 && !item.coming_soon) {
                  filteredData.push(item);
                }
              });
            } else {
              data.forEach((item) => {
                if (getMonth.indexOf(new Date(item.start_date).getMonth().toString()) >= 0 && !item.coming_soon) {
                  filteredData.push(item);
                }
              });
            }
            isDateProcessedOnce = true;
          }
        }
        isFunctionProcessedOneFilter = true;
      });
      return filteredData;
    } else {
      return data;
    }
  }
}
