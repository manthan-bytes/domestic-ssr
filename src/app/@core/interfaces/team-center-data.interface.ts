export interface TeamCenterRace {
  data: TeamCenterData;
}
interface TeamCenterData {
  fetchRaceByIdOrSlug: TeamCenterInterface;
}

export interface TeamCenterInterface {
  id: number;
  alias: string;
  in_migration: boolean | string;
  volunteer_contact_email: string;
  legs: Leg[];
  updates: Update[];
  files: Files;
  check_in_waiver: string;
  venue_check_in_waiver: string;
  race_check_in_confirmation: string;
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
  volunteer_packet: string;
  race_bible: string;
  photos: Photo[];
}

export interface Photo {
  path: string;
}

export interface Leg {
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

export interface Update {
  id: number;
  race_id: number;
  title: string;
  content: string;
  image: null;
  video_url: null | string;
  favourite: null;
}
