import { Pipe, PipeTransform } from '@angular/core';
import { badgeDays } from '../utils/var.constant.service';

@Pipe({
  name: 'calculateRemainingDays',
})
export class CalculateRemainingDaysPipe implements PipeTransform {
  transform(activityStreak: number): number {
    for (var index = 0; index < badgeDays.length; index++) {
      if (activityStreak >= 31) {
        return 0;
      } else {
        if (activityStreak == badgeDays[index]) {
          return badgeDays[index + 1] - activityStreak;
        } else if (badgeDays[index] > activityStreak) {
          return badgeDays[index] - activityStreak;
        }
      }
    }
  }
}
