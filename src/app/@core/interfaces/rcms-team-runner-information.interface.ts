export interface TeamAndRunnerInformation {
  team: Team;
  runners: UserRegistrationInfo[];
  volunteers: UserRegistrationInfo[];
  captain: UserRegistrationInfo;
}

export interface UserRegistrationInfo {
  id: string;
  registrationConfigId: string;
  teamId: string;
  teamName: string;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  bornAt: string;
  gender: string;
  phone: string;
  address: string;
  address2: null | string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  pace: number;
  order: number;
  shiftId: null | string;
  shiftConfirmed: number;
  tShirtSize: null | string;
  teamVan: null;
  profilesId: string;
  extraFees: number;
  waiversSigned: number;
  createdAt: string;
  updatedAt: string;
  shiftStartDate: null | string;
  shiftStartTime: number | null;
  shiftEndDate: null | string;
  shiftEndTime: number | null;
  jobLocation: null | string;
  onlineWebCheckInId: string | null;
}

export interface Team {
  id: string;
  registrationConfigId: string;
  groupId: null;
  groupSort: null;
  paidExemptions: number;
  volunteersCount: number;
  isGlampingPurchased: boolean;
  glampingPurchasedDate: string;
  teamNumber: number;
  runnersCount: number;
  runnersMax: number;
  vanNumber: null;
  registrationPrice: null;
  classification: null;
  type: string;
  registrationPeriod: string;
  division: null;
  exemptions: number;
  name: string;
  teamPace: number;
  promoCode: null;
  startTime: null;
  runOption: null;
  totalLateFeeAmount: number;
  paidLateFeeAmount: number | null;
  volunteerOptFees: null;
  paidVolunteerOptFees: null;
  notes: null;
  isCheckedIn: number;
  isTermAccepted: number;
  qrCode: null | string;
  van1Phone: null | string;
  van2Phone: null | string;
  qrDateTime: null;
  CT_ID: null;
  CT_TEAM_ID: null;
  CT_TIER_ID: null;
  CT_TIER_TEXT: null;
  CT_PROMOCODE_ID: null;
  createdAt: string;
  updatedAt: string;
  isAdminUpdated: number;
  createdBy: null;
  updatedBy: null;
  team2name: null;
  team2firstName: null;
  team2lastName: null;
  team2email: null;
  volunteerRequired: number;
  checkedInConfirmationNumber: number | string;
}

export interface InvitedUser {
  id: string;
  registrationConfigId: string;
  teamId: string;
  registrationId: string | number;
  email: string;
  joinedDate: Date;
  status: string;
  message: string;
  invitationType: string;
  createdAt: string;
  updatedAt: string;
  isAdminUpdated: number;
  createdBy: string;
  updatedBy: string;
}
