export interface EventData {
  cmsEvent: CmsEvent;
  classifications: Classification[];
  divsions: Division[];
  ongoing: OnGoing[];
}
export interface EventPrice {
  types: object[];
  registrationClose: Date;
}

export interface Division {
  name: string;
}
export interface OnGoing {
  type: string;
}

export interface Classification {
  name: string;
}

export interface VolunteersConfig {
  deleteVolunteer: boolean;
  onResendLoadingBar: unknown /* TODO: No data has pushed to array */;
}

export interface TeamDetailsConfig {
  editOption: boolean;
  onSaveLoadingBar: boolean;
}

export interface RosterConfig {
  deleteRunner: boolean;
  onResendLoadingBar: unknown;
}

export interface CheckInConfig {
  showCheckingStatus: boolean;
  showSorryMsg: boolean;
  isCheckedSafety: boolean;
  van1: string | number;
  van2: string | number;
}

export interface CmsEvent {
  showCheckin: boolean;
  updates: Update[];
  files: Files;
  volunteer_contact_email: string;
}

export interface Update {
  id: number;
  race_id: number;
  title: string;
  content: string;
  image: string | null;
  video_url: string | null;
  favourite: boolean;
  create_date: string;
  update_date: string;
}
export interface Files {
  id: number;
  race_id: number;
  logo: string;
  logo_white: string;
  training_badge: null;
  finisher_badge: null;
  map: string;
  map_preview: null;
  banner: string;
  tile: string;
  racebook: string;
  safety_handbook: null;
  raceday_handbook: null;
  ultrateams_handbook: null;
  hold_times: string;
  photos: Photo[];
  volunteer_packet: string;
  race_bible: string;
}

export interface Photo {
  path: string;
}

export interface Legs {
  leg_number: number;
  distance: number;
  distance_km: number;
  difficulty: Difficulty;
}

export enum Difficulty {
  Easy = 'Easy',
  Hard = 'Hard',
  Moderate = 'Moderate',
  VeryHard = 'Very Hard',
}
