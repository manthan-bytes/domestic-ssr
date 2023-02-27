export interface OverviewRaceDataClass {
  data: OverviewData;
}
interface OverviewData {
  fetchRaceByIdOrSlug: OverviewRaceData;
}
export interface OverviewRaceData {
  id: string;
  alias: string;
  name: string;
  charity: string;
  intro: string;
  start_time_posted: string;
  start_date: string;
  volunteer_start_date: string;
  volunteer_end_date: string;
  end_date: string;
  start_city: string;
  end_city: string;
  type: string;
  meta_description: string;
  registration_opens: string;
  registration_closes: string;
  coming_soon: boolean;
  waitlist_flag: boolean;
  prelaunch_flag: boolean;
  lottery_flag: boolean;
  lottery_msg: string;
  reg_source: string;
  video_url: string;
  waitlist_url: string;
  prelaunch_url: string;
  reg_system: RegSystem;
  regStatusLabel?: string;
  regStatus?: string;
  fb_url: string;
  change_fee_20usd_start: string;
  pay_for_volunteers_deadline: string;
  final_online_runner_invite_deadline: string;
  team_name_change_deadline: string;
  director: Director;
  files: FilesForDateAndUpdate;
  updates: Updates[];
  aliasName?: string;
  juicer_id: string;
  country?: string;
  menuUrl?: string;
  pricing: PricingPacks[];
  updatedPricing?: UpdatedPricing;
  social_results: SocialResultsPhotos[];
  social_photos: SocialResultsPhotos[];
  captains_tools: CaptainTools[];
  trips: Trips[];
  sponsors: RaceSponsors[];
  is_registartion_close: boolean;
  registration_close_reason: RegisterCloseReason;
}
interface RegisterCloseReason {
  title: string;
  description: string;
}
interface UpdatedPricing {
  REGULAR?: Pricing[];
  ULTRA?: Pricing[];
  SIX_PACK?: Pricing[];
  HIGH_SCHOOL?: Pricing[];
  BLACK_LOOP?: Pricing[];
}
interface RaceSponsors {
  name: string;
  logo_white: string;
  url: string;
}
interface Trips {
  id: number;
  race_id: number;
  title: string;
  type: string;
  value: string;
  sort: number;
}
export interface PricingPacks {
  name: string;
  label: string;
  teamSize: number;
  teamPrice: string;
  startDate: string;
  endDate: string;
  description?: string;
  isInactive?: boolean;
  isComing?: boolean;
  isActive?: boolean;
}

interface Pricing {
  isInactive?: boolean;
  isComing?: boolean;
  isActive?: boolean;
  stages: PricingStage;
  description?: string;
  regType?: string;
  teamPrice?: string;
  teamSize?: number;
}
interface PricingStage {
  label: string;
  isInactive?: boolean;
  teamPrice: string;
  startDate: string;
  endDate: string;
  isComing?: boolean;
  isActive?: boolean;
}

export interface Files {
  banner: string;
  logo_white: string;
  photos?: { path: string };
  race_checkin_safety_video: string;
  race_covid_safety_video: string;
}

interface RegSystem {
  eventURL: string;
}

export interface Charities {
  id: string;
  name: string;
  charity: string;
}

export interface DatesAndUpdateData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  fb_url: string;
  type: string;
  volunteer_start_date: string;
  volunteer_end_date: string;
  registration_opens: string;
  registration_closes: string;
  start_time_posted: string;
  final_online_runner_invite_deadline: string;
  change_fee_20usd_start: string;
  team_name_change_deadline: string;
  pay_for_volunteers_deadline: string;
  updates: Updates[];
  director: Director[];
  files: FilesForDateAndUpdate;
}
interface CaptainTools {
  id: number;
  title: string;
  value: string;
  value_type: string;
  type: string;
}
interface SocialResultsPhotos {
  id: string;
  year: string;
  url: string;
  sort: number;
}

export interface Updates {
  content: string;
  image: string;
  video_url: string;
  favourite: string;
}
interface Director {
  first_name: string;
  last_name: string;
  facts?: Facts[] /*TODO: Remove optional after prod while prod build */;
  image: string;
  description: string;
}
interface Facts {
  id: number;
  value: string;
  sort: number;
}
interface FilesForDateAndUpdate {
  banner: string;
  logo_white: string;
  race_bible: string;
  photos: PhotosForCourse[];
}

export interface CourseData {
  id: string;
  name: string;
  type: string;
  distance_units: string;
  files: FilesForCourse;
  legs: Lags[];
  exchanges: Exchanges;
  village: string;
}

interface FilesForCourse {
  racebook: string;
  photos: PhotosForCourse;
}

interface PhotosForCourse {
  path: string;
}

export interface Lags {
  name?: string;
  leg_number: number;
  distance_km: number;
  difficulty: string;
  distance: number;
  elevation_gain: number;
  elevation_loss: number;
  elevation_gain_m: number;
  elevation_loss_m: number;
  van_support: string;
  ragnar_leg: boolean;
  blackloop: boolean | string;
  points: Points;
  end_point: EndPoint;
  start_point: StartPoint;
  description: string;
  notes: string;
  turn_by_turn: string;
  van_directions: string;
  exchange_address: ExchangeAddress;
  color: string;
}

interface Points {
  lat: number;
  lon: number;
  ele: number;
}

interface Exchanges {
  name: string;
  photo: string;
  description: string;
}
interface StartPoint {
  lat: string;
  long: string;
}
interface EndPoint {
  lat: string;
  long: string;
}
interface ExchangeAddress {
  name: string;
  address_1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude: string;
  longitude: string;
  note: string;
}
