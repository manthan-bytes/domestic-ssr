export interface Races {
  data: Data;
}

export interface Data {
  fetchRaceList: FetchRaceList[];
}

export interface FetchRaceList {
  id: number;
  name: string;
  type: Type;
  country: string;
  alias: string;
  region: string;
  subregion?: string;
  coming_soon: boolean;
  start_date: null | string;
  end_date: null | string;
  lat: number;
  lng: number;
  start_state: string;
  start_city: string;
  end_city: string;
  files: Files;
  menuUrl: string;
  aliasName: string;
  displayName: string;
}

export interface Files {
  tile: string;
}

export enum Type {
  Relay = 'relay',
  Sprint = 'sprint',
  Sunset = 'sunset',
  Trail = 'trail',
}

export interface FetchRaceByIDOrSlug {
  data: Data;
}

export interface Data {
  fetchRaceByIdOrSlug: FetchRaceByIDOrSlugClass;
}

export interface FetchRaceByIDOrSlugClass {
  id: number;
  type: string;
  intro?: string;
  start_date?: string;
  end_date?: string;
  end_city?: string;
  start_city?: string;
  registration_opens?: string;
  registration_closes?: string;
  coming_soon?: boolean;
  waitlist_flag?: boolean;
  prelaunch_flag?: boolean;
  lottery_flag?: boolean;
  reg_source?: string;
  video_url?: string;
  name?: string;
  lottery_msg?: string;
  waitlist_url?: string;
  prelaunch_url?: string;
  charity?: string;
  reg_system?: RegSystem;
  files?: Files;
  regStatus?: string;
  menuUrl?: string;
  regStatusLabel?: string;
  director?: string;
}

export interface Files {
  banner: string;
  logo_white: string;
}

export interface RegSystem {
  eventURL: string;
}

export interface Sponsors {
  data: {
    getSponsors: {
      id?: number;
      name?: string;
      featured?: boolean;
      logo?: string;
      url?: string;
      logo_white?: string;
      slug?: string;
      logo_black?: string;
      home_trail?: boolean;
      home_trail_sort?: number;
      home_relay?: boolean;
      home_relay_sort?: number;
      trail_supporting?: boolean;
      trail_official?: boolean;
      relay_supporting?: boolean;
      relay_official?: boolean;
      sort?: boolean;
      description?: string;
    };
  };
}

export interface Sponsor {
  data: {
    getSponsorBySlug: {
      id: string | null;
      name: string | null;
      dealText: string | null;
      featured: string | null;
      logo: string | null;
      logo_white: string | null;
      logo_black: string | null;
      description: string | null;
      buttonTitle: string | null;
      url: string | null;
    };
  };
}
