import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shotUserName' })
export class ShortUserNamePipe implements PipeTransform {
  constructor() {}
  transform(fullName: string): string {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('');
  }
}

@Pipe({ name: 'phoneFilter' })
export class PhoneFilterPipe implements PipeTransform {
  constructor() {}
  transform(input: string): string {
    const s2 = ('' + input).replace(/\D/gm, '');
    const lastDigit = s2.length > 10 ? s2.length - 6 : 4;
    const m = s2.match(new RegExp('^(\\d{3})(\\d{3})(\\d{' + lastDigit + '})$'));
    return !m ? input : '(' + m[1] + ') ' + m[2] + '-' + m[3];
  }
}

@Pipe({ name: 'parseImageUrl' })
export class ParseImageUrlPipe implements PipeTransform {
  constructor() {}
  transform(value: string): string {
    if (value) {
      value = value.replace(/ /g, '%20');
    }
    return !value ? '' : value;
  }
}

@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
  constructor() {}
  transform(value: string): string {
    if (value && value !== 'Closes') {
      value = '$' + value;
    }
    return !value ? '' : value;
  }
}
