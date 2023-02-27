import { Directive, HostListener, ElementRef, OnChanges, Input } from '@angular/core';

@Directive({ selector: '[appAutoSlashCCDate]' })
export class AutoSlashCCDateDirective implements OnChanges {
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
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      this.el.value = value;
    }
  }
}
