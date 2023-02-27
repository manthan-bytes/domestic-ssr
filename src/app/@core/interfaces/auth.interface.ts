export class Login {
  email: string;
  password: string;
}

export class UserInfo {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  emailAddress?: string;
  email?: string;
  phone?: string;
  address?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  state?: string;
  country?: string;
  identityId?: string;
  userPoolId?: string;
  shirtSize?: string;
  shoeSize?: string | null;
  profileHeader?: string | null;
  profilePhoto?: string;
  runPace?: number;
  reebokUpdates?: boolean;
  googleId?: string | null;
  facebookId?: string | null;
  isNew?: boolean | null;
  lastLatitude?: number | null;
  lastLongitude?: number | null;
  lastIpLogin?: string | null;
  secondaryEmails?: string | null;
  newsletterUpdates?: boolean | null;
  REIEmail?: boolean | null;
  suuntoAthletes?: boolean | null;
  salomonAthletes?: boolean | null;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  isAdminUpdated?: number;
  jwtToken?: string;
  password?: string;
  stravaUserDetail?: StravaUserDetail;
  waiver?: boolean;
}

export interface StravaUserDetail {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  expires_in: number;
  athlete: Athlete;
}

export interface Athlete {
  country: string;
  profile_medium: string;
  firstname: string;
  resource_state: number;
  sex: string;
  profile: string;
  created_at: string;
  summit: boolean;
  lastname: string;
  premium: boolean;
  updated_at: string;
  badge_type_id: number;
  id: number;
  state: string;
}
