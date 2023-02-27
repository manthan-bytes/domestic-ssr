import { RcmsEventDetail } from '@core/interfaces/rcms-event-details.interface';
import { UserRegistrationInfo, Team, InvitedUser } from '@core/interfaces/rcms-team-runner-information.interface';

export interface TeamVolunteerFeesComponentData {
  type: string;
  teamInformation: Team;
  selectedEvent: RcmsEventDetail;
  baseVolunteerCharge: number /* TODO: Need to make it Configurable as per team-details-component */;
}

export interface RunnerVolunteerInviteComponentData {
  type: string;
  registrationConfigId: string | number;
  teamNameChange: string;
  registrationClose: string;
  teamFreezeDate: string;
  teamId: string | number;
  captainEmail: string;
  runnerEmails: string[];
  inviteEmails: string[];
  captainInformation: UserRegistrationInfo;
  teamInformation: Team;
  isCaptainVolunteer: boolean;
  volunteerCount: number;
  selectedEvent: RcmsEventDetail;
  volunteerContactEmail: string;
  volunteerShiftClose: string;
  volunteerEmails: string[];
}

export interface RunnerVolunteerInviteCaptainData {
  bornAt: string;
  email: string;
  firstName: string;
  id: string | number;
  lastName: string;
  phone?: number | string;
  jwtToken: string | false;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string | number;
  tShirtSize?: string;
  gender?: string;
}

export interface RunnerVolunteerInviteData {
  teamNameChange: string;
  registrationConfigId: string | number;
  volunteerShiftClose?: string;
  teamId: string | number;
  captainData?: string /* TODO: Need to confirm type */;
  captainEmail: string;
  runnerVolunteerEmails: string[];
  inviteEmails: string[];
  registrationClose?: string;
  teamFreezeDate?: string;
}

export interface RunnerVolunteerDeleteComponentData {
  type: string;
  deleteInfo: UserRegistrationInfo;
  runnerVolunteerInformation: UserRegistrationInfo[];
  isMemberVolunteerDelete: boolean;
  invitationInformation: InvitedUser[];
}
