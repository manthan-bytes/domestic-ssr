import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { badgeDays } from '../utils/var.constant.service';

@Directive({
  selector: '[appNextStreak]',
})
export class NextStreakDirective implements AfterViewInit {
  @Input() public activityStreak: string;
  @Input() public maxDays: number;
  private el: HTMLInputElement;

  constructor(public element: ElementRef) {
    this.el = this.element.nativeElement;
  }

  ngAfterViewInit(): void {
    const streak = +this.activityStreak;

    let nextBadgeDay = 0;
    nextBadgeDay = badgeDays.find((day) => streak < day);
    const streakPercent = ((nextBadgeDay - streak) * 100) / this.maxDays;
    this.el.style.paddingRight = `${streakPercent}%`;
  }
}
