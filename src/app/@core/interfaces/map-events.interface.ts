export interface MapEventsData {
  eventData: EventData;
  windowOptions: WindowOptions;
  id: number;
  latitude: number;
  longitude: number;
  templateUrl: TemplateURL;
  icon: Icon;
}

export interface EventData {
  id: number;
  alias: string;
  type: Type;
  registrationUrl: string;
  name: string;
  startCity: string;
  endCity: string;
  startDate: null | string;
  endDate: null | string;
  regStatus?: string;
  regStatusLabel: RegStatus;
  lat: number;
  lng: number;
  coming_soon: boolean;
  tile: string;
}

enum RegStatus {
  Register = 'REGISTER',
  Lottery = 'LOTTERY',
  Wait_List = 'WAIT_LIST',
  Prelaunch = 'PRELAUNCH',
  Not_Open_Yet = 'NOT_OPEN_YET',
  Coming_Soon = 'COMING_SOON',
}

enum Type {
  Relay = 'relay',
  Sprint = 'sprint',
  Sunset = 'sunset',
  Trail = 'trail',
  Trail_Sprint = 'trail_sprint',
}

enum Icon {
  ImagesMapOverviewLocationIconPNG = 'images/map-overview/location-icon.png',
}

enum TemplateURL {
  PartialsMapIncludesInfoWindowHTML = 'partials/map/includes/info-window.html',
}

interface WindowOptions {
  boxClass: BoxClass;
}

enum BoxClass {
  Infobox = 'infobox',
}
