export interface MeetupCalenderList {
  id: number;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;
  name: string;
  dateCalendarStart?: string;
  dateCalendarEnd?: string;
}

export interface BannersList {
  id: number;
  thumbTitle: string;
  imageThumb: string;
  imageThumbMobile: string;
  imageBanner: string;
  title: string;
  description: string;
  buttonOneTitle: string;
  buttonOneLink: string;
  buttonTwoTitle: string;
  buttonTwoLink: string;
  isSelfTarget: boolean;
}

export interface Testimonials {
  quote: string;
  author: string;
  id: number;
}

export interface BannersListNew {
  id: string;
  title: string;
  isMainBanner: boolean;
  sliderImage: string;
  description: string;
  buttonTitle: string;
  buttonLink: string;
  bannerTitle: string;
  buttonImage: string;
  landscapeBanner: string;
  portraitBanner: string;
  isSelfTarget: boolean;
  is_active: boolean;
}
