import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileNameAndType',
})
export class FileNameAndTypePipe implements PipeTransform {
  transform(value): string {
    if (value) {
      if (value.split('.')[value.split('.').length - 1].includes('pdf') || value.split('.')[value.split('.').length - 1].includes('xlsx')) {
        value = value.split('/').pop();
        if ((value || '').split('_').length > 0 && isFinite((value || '').split('_')[0])) {
          return decodeURI((value || '').split('_')[1]);
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}
