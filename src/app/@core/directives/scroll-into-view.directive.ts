import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({ selector: '[appScrollIntoView]' })
export class ScrollIntoViewDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('click') onClick() {
    this.el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  }
}
