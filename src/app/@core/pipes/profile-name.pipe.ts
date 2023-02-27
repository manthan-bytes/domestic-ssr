import { Pipe, PipeTransform } from '@angular/core';
import { UserProfileDetails } from '../../@components/virtual-challenge/activity-feed/user-profile-details';

@Pipe({
  name: 'profileName',
})
export class ProfileNamePipe implements PipeTransform {
  transform(profileId: string, userProfileDetails: Array<UserProfileDetails>): string {
    const result = userProfileDetails.find((element) => element.profileId === profileId);
    return result ? result.memberName : '';
  }
}
