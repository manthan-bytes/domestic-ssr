export interface RcmsEventDetail {
  id: string;
  endDate: string;
  name: string;
  startDate: string;
  taxes: Taxes;
  teamCap: number;
  teamGoal: number;
  blackloopTeamGoal: number;
  teamNameChange: string;
  timezone: string;
  type: string;
  glampingPrice: number;
  lastTeamNumber: number;
  isLive: boolean;
  onlineFeeDate: Date;
  keywords: string;
  lateFee10: Date;
  lateFee10Amount: number;
  lateFee20: Date;
  lateFee20Amount: number;
  registrationClose: string;
  registrationOpen: string;
  raceId: number;
  raceYear: number;
  teamCount: number;
  registrationsCount: number;
  registrations: Registrations;
  period: string;
  teamFreezeDate: string;
  group_vol_minor_url: string;
  CT_ID: number;
  createdAt: string;
  updatedAt: string;
  isAdminUpdated: number;
  createdBy: string;
  updatedBy: string;
  cms_race_id: number;
  cms_race_slug: string;
  volunteerDeadline: Date;
  volunteerShiftOpen: string;
  volunteerShiftClose: string;
  volunteerRequired: VolunteerRequired;
  disableVolunteerInvite: boolean;
  isVolShiftActive: boolean;
  disableVolunteer: boolean;
  shiftClosed: boolean;
  disableInvite: boolean;
  shiftNotOpened: boolean;
  freezeTeam: boolean;
  showCheckin: boolean;
  disableTeamNameEdit: boolean;
  disableClassificationDivision: boolean;
  isTeamFull: boolean;
  disableDelete: boolean;
  inviteFee: number;
  chargeInvite: boolean;
  start_date: string;
  timeToCheckin: boolean;
  check_in_waiver: string;
  venue_check_in_waiver: string;
  race_check_in_confirmation: string;
  files: { race_checkin_safety_video: string; race_covid_safety_video: string };
}

export interface Registrations {
  VIP: RegDetail;
  EARLY: RegDetail;
  REGULAR: RegDetail;
  LAST_CHANCE: RegDetail;
}

export interface RegDetail {
  count: number;
  totalPrice: number;
  endDate: string;
}

export interface Taxes {
  [key: string]: TaxeDetail;
}

export interface TaxeDetail {
  enabled: boolean;
  transactionFee: number;
  id: string;
}

export interface VolunteerRequired {
  REGULAR: VolunteerRequiredDetail;
  ULTRA: VolunteerRequiredDetail;
  HIGH_SCHOOL: VolunteerRequiredDetail;
}

export interface VolunteerRequiredDetail {
  VIP: number;
  EARLY: number;
  REGULAR: number;
  LAST_CHANCE: number;
}

export interface ClassificationAndDivision {
  id: string;
  registrationConfigId: string;
  name: string;
  CT_ID: number;
  createdAt: string;
  updatedAt: string;
  isAdminUpdated: number;
  createdBy: string;
  updatedBy: string;
}

export interface Glampings {
  endDate: number;
  glampingCap: number;
  glampingCount: number;
  glampingPrice: number;
  id: string;
  name: string;
  raceYear: number;
  startDate: string;
}

export interface GlampingCoupon {
  total: string;
  subTotal: string;
  discounts: string;
}

export interface CreateInviteBulkResponse {
  id: string;
  challengeId: string;
  challengeTeamId: string;
  profileId: null | string;
  email: string;
  status?: string;
  joinedDate?: null | string;
  message: string;
}
