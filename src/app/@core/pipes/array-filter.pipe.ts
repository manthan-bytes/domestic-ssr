import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayFilter',
})
export class ArrayFilterPipe implements PipeTransform {
  transform(arrayData: unknown[], field: string, value: string): unknown[] {
    if (arrayData) {
      return arrayData.filter((data) => data[field] === value);
    }
    return [];
  }
}
