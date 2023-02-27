import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'paceFilter' })
export class PaceFilterPipe implements PipeTransform {
  transform(input): string {
    let sec = parseInt(isNaN(input) ? 0 : input, 10);
    sec = sec >= 0 ? sec : 0;
    const min = Math.floor(sec / 60);
    return ('0' + min).slice(-2) + ':' + ('0' + (sec - min * 60)).slice(-2);
  }
}
