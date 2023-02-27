import { Directive, HostListener, ElementRef, OnChanges, Input } from '@angular/core';

@Directive({ selector: '[appPhone]' })
export class PhoneDirective implements OnChanges {
  @Input() public ngModel;
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('change') ngOnChanges() {
    this.setSlash(this.el.value);
  }

  setSlash(value) {
    value = value.replace(/\D/gm, '');
    let viewValue = '';

    if (value.length > 0) {
      viewValue = '(' + value;
      if (value.length > 2) {
        viewValue = '(' + value.substring(0, 3) + ')';
        if (value.length > 3) {
          viewValue = viewValue + ' ' + value.substring(3, 6);
          if (value.length > 6) {
            viewValue = viewValue + '-' + value.substring(6, 10);
          }
        }
      }
      this.el.value = viewValue;
    } else {
      this.el.value = '';
    }
  }
}
