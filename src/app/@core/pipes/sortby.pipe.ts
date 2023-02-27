import { Pipe, PipeTransform } from '@angular/core';
import orderBy from 'lodash/orderBy';

@Pipe({ name: 'sortBy' })
export class SortByPipe implements PipeTransform {
  transform(value: unknown[], order: any = '', column: string = ''): unknown[] {
    if (!value || order === '' || !order) {
      return value;
    } // no array
    if (value.length <= 1) {
      return value;
    } // array with only one item
    if (!column || column === '') {
      if (order === 'asc') {
        return value.sort();
      } else {
        return value.sort().reverse();
      }
    } // sort 1d array
    return orderBy(value, [column], [order]);
  }
}
