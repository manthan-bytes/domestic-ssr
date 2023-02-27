/* Commented as per RW-453
const RAGNAR_CHALLENGES = 'http://www.ragnarchallenges.com/'; */
const CAREERS = 'https://recruiting.paylocity.com/Recruiting/Jobs/All/e62b5ce9-0171-452e-805a-3ca8439fd139/Ragnar-Events-LLC';
const CONTACT_US = 'https://ragnarrelay.zendesk.com/hc/en-us/categories/200168249-U-S-Canada-Support';
const COMMUNITY_VOLUNTEERS = 'https://airtable.com/shrrhOpONUZfZRVlq';
const OUR_CAUSE = 'https://run.ragnarrelay.com/jdrf/lp/';
const RAGNAR_GEAR_STORE = 'https://www.ragnargear.com/';
const EVENT_SPECIFIC_FINISHER_ITEMS = 'https://stores.customink.com/ragnarfinisher';
const CUSTOM_TEAM_SHIRTS = 'https://www.customink.com/ink/partners/ragnar-relay';

export const staticRoutes = {
  main: '',
  home: '',
  pageNotFound: 'page-not-found',
};

export const eventDetailRoutes = {
  main: 'event-detail',
};

export const authRoutes = {
  main: 'auth',
  login: 'login',
  createAccount: 'create-account',
  forgotPassword: 'forgot-password',
  resetPassword: 'reset-password',
};

export const MapRoute = {
  map: 'map',
};

export const HomeV2Route = {
  main: 'homev2',
};

export const StaticPageRoutes = {
  main: '',
  innovationLab: 'innovation',
  glamping: 'ragnar-glamping',
  ambassadors: 'https://run.ragnarrelay.com/ragnarambassador/',
  covid_safety_plan: 'https://run.ragnarrelay.com/covid_general',
  divisionsAndClassifications: 'divisions-and-classifications',
  loveTheLocals: 'love-the-locals',
  medals: 'medals',
  meetupCalendar: 'meetup-calendar',
  companyHistory: 'company-history',
  // roadPartners: 'partners/road',
  safetyRoad: 'safety-road',
  safety: 'safety',
  sustainability: 'sustainability',
  // trailPartners: 'partners/trail',
  runnerRequiredVolunteer: 'volunteer',
  whatIsRagnar: 'ragnar',
  whatIsRagnarRoad: 'road',
  whatIsRagnarTrail: 'trail',
  whatIsRagnarSunset: 'sunset',
  whatIsRagnarBlackloop: 'blackloop',
  privacyPolicy: 'privacy-policy',
  planYourTrip: 'plan-your-trip',
  termsOfUse: 'terms-of-use',
  purchasePolicy: 'purchase-policy',
  volunteerContact: 'volunteer-contact',
  ambassadorsForm: 'form',
  trainingRoad: 'training/road',
  welcome: 'welcome',
  partners: 'partners',
  partner: 'partner',
};

export const virtualChallengeRoutes = {
  main: 'challenge',
  home: 'home',
  howItWorks: 'how-it-works',
  info: 'info',
  dashboard: 'dashboard',
  userProfile: 'profile',
  publicShare: 'progress',
  chooseTeam: 'choose-team',
  DcDashboard: '31days-dashboard',
};

export const registrationRoutes = {
  main: 'register',
  virtualChallenge: 'virtual-challenge',
  selectPlan: 'select-plan',
  personalInfo: 'personal-info',
  payment: 'payment',
};

export const TeamCenterRoutes = {
  main: 'teamcenter',
};

export const footerRoutes = {
  exploreMap: MapRoute.map,
  /* Commented as per RW-453
  ragnarchallenges: `${RAGNAR_CHALLENGES}`, */
  innovationLab: StaticPageRoutes.innovationLab,
  ragnarTrailGlamping: StaticPageRoutes.glamping,
  whatIsRagnar: StaticPageRoutes.whatIsRagnar,
  teamsDivisions: StaticPageRoutes.divisionsAndClassifications,
  medals: StaticPageRoutes.medals,
  safety: StaticPageRoutes.safetyRoad,
  ourStory: StaticPageRoutes.companyHistory,
  careers: `${CAREERS}`,
  contactUs: `${CONTACT_US}`,
  privacyPolicy: StaticPageRoutes.privacyPolicy,
  termsOfUse: StaticPageRoutes.termsOfUse,
};

export const headerRoutes = {
  exploreMap: MapRoute.map,
  /* Commented as per RW-453
  ragnarchallenges: `${RAGNAR_CHALLENGES}`, */
  innovationLab: StaticPageRoutes.innovationLab,
  ragnarTrailGlamping: StaticPageRoutes.glamping,
  whatIsRagnar: StaticPageRoutes.whatIsRagnar,
  teamsDivisions: StaticPageRoutes.divisionsAndClassifications,
  medals: StaticPageRoutes.medals,
  safety: StaticPageRoutes.safetyRoad,
  covid_safety_plan: StaticPageRoutes.covid_safety_plan,
  runnerRequiredVolunteers: StaticPageRoutes.runnerRequiredVolunteer,
  ourStory: StaticPageRoutes.companyHistory,
  careers: `${CAREERS}`,
  contactUs: `${CONTACT_US}`,
  meetups: StaticPageRoutes.meetupCalendar,
  blog: 'https://www.runragnar.com/blog/',
  communityVolunteers: `${COMMUNITY_VOLUNTEERS}`,
  ambassadors: StaticPageRoutes.ambassadors,
  ambassadorsForm: `${StaticPageRoutes.ambassadors}/${StaticPageRoutes.ambassadorsForm}`,
  ourCause: `${OUR_CAUSE}`,
  // roadPartners: StaticPageRoutes.roadPartners,
  // trailPartners: StaticPageRoutes.trailPartners,
  sustainability: StaticPageRoutes.sustainability,
  loveTheLocals: StaticPageRoutes.loveTheLocals,
  ragnarGearStore: `${RAGNAR_GEAR_STORE}`,
  eventSpecificFinisherItems: `${EVENT_SPECIFIC_FINISHER_ITEMS}`,
  customTeamShirts: `${CUSTOM_TEAM_SHIRTS}`,
  teamCenter: TeamCenterRoutes.main,
  volunteerContact: StaticPageRoutes.volunteerContact,
  whatIsRagnarRoad: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarRoad}`,
  whatIsRagnarTrail: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarTrail}`,
  whatIsRagnarSunset: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarSunset}`,
  whatIsRagnarBlackloop: `${StaticPageRoutes.whatIsRagnar}/${StaticPageRoutes.whatIsRagnarBlackloop}`,
  trainingRoad: StaticPageRoutes.trainingRoad,
  purchasePolicy: StaticPageRoutes.purchasePolicy,
  partners: StaticPageRoutes.partners,
};
