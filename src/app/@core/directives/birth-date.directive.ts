import { Directive, HostListener, ElementRef, OnChanges, Input } from '@angular/core';

@Directive({ selector: '[appBirthdate]' })
export class BirthdateDirective implements OnChanges {
  @Input() public ngModel;
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('change') ngOnChanges() {
    this.setSlash(this.el.value);
  }

  setSlash(value) {
    if (value) {
      value = value.replace(/\ /g, '').replace(/\:/g, '').replace(/\D/g, '');
      if (value.length === 2) {
        value = value + '/';
      } else if (value.length > 2 && value.length <= 4) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
        if (value.length === 5) {
          value = value + '/';
        }
      } else if (value.length > 4) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
      }
      this.el.value = value;
    }
  }
}
