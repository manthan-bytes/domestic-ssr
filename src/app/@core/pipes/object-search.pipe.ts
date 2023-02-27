import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objectSearch' })
export class ObjectSearchPipe implements PipeTransform {
  constructor() {}
  transform(data: unknown[], key: string, searchText: string): unknown[] {
    if (key && searchText) {
      return data.filter((m) => {
        return m[key].toLowerCase().includes(searchText);
      });
    } else {
      return data;
    }
  }
}
