export interface VirtualChallengeList {
  id: string;
  raceId: number;
  name: string;
  description: string;
  maxDays: number;
  startDate: string;
  endDate: string;
  challengeGraceDate: null;
  unitType: string;
  unitValue: number;
  year: number;
  maxTeams: number;
  isLive: number;
  isFeatured: number;
  challengeType: string;
  content: Content;
  ecommerce: null;
  setting: null;
  waiver: string;
}

export interface Content {
  homePage: HomePage;
  infoPage: InfoPage;
  common: Common;
  dashboard: Dashboard;
}

export interface Common {
  howItWorks: HowItWork[];
}

export interface HowItWork {
  id: string;
  name: Name;
  description: string;
}

export enum Name {
  Step1 = 'Step 1',
  Step2 = 'Step 2',
  Step3 = 'Step 3',
}

export interface Dashboard {
  faq: FAQ;
  isShowPrintableCalendar: boolean;
  dailyMotivation: Tion;
  upgradeExperienceSection: Tion;
}

export interface Tion {
  isShow: boolean;
  title: string;
  subTitle: string;
  data?: DailyMotivationDatum[];
}

export interface DailyMotivationDatum {
  id: string;
  image: string;
  text: string;
  title: string;
  description: string;
  btnText: string;
  btnLink: string;
}

export interface FAQ {
  isShow: boolean;
  data: FAQDatum[];
}

export interface FAQDatum {
  id: number;
  title: string;
  description: string;
}

export interface HomePage {
  tileImage: string;
}

export interface InfoPage {
  headerLogo: string;
  swagSection: SwagSection;
}

export interface SwagSection {
  isShow: boolean;
  image: string;
  description: string;
  btnText: string;
  btnLink: string;
}
