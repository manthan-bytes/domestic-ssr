import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Pipe({
  name: 'sanitizeUrl',
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private sanitizer?: DomSanitizer) {}
  transform(value: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
@Pipe({
  name: 'sanitizeExternalUrl',
})
export class SanitizeSMSUrlPipe implements PipeTransform {
  constructor(private sanitizer?: DomSanitizer) {}
  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}
