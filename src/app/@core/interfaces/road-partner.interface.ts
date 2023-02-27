export interface RoadPartners {
  id: number;
  name: string;
  featured: boolean;
  logo: null | string;
  url: string;
  logo_white: null | string;
  logo_black: null | string;
  home_trail: boolean;
  home_trail_sort: number | null;
  home_relay: boolean;
  home_relay_sort: number | null;
  trail_supporting: boolean | string | null;
  trail_official: boolean | string | null;
  relay_supporting: boolean | string | null;
  relay_official: boolean | string | null;
  sort: boolean;
  description: null | string;
  showSupportingPopup?: boolean;
  showOfficialPopup?: boolean;
}
