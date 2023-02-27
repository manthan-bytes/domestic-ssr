export interface DashboardBehviourSubject {
  label?: string;
  value?: string;
  icon?: string;
  exclude?: string;
}
export interface VirtualChallengeDetail {
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: string;
  updatedBy: string;
  resultSeen?: boolean;
  createdAt: string;
  updatedAt: string;
  name: string;
  maxDays: number;
  startDate: string;
  endDate: string;
  graceDate: string;
  isLive: number;
  isFeatured: number;
  unitType: string;
  unitValue: number;
  challengeType: string;
  challengeSubType: string;
  contents: Contents;
  eCommerce: ECommerce[];
  challengeTeamId?: string;
  challengeMemberId?: string;
  isAlreadyRun?: boolean;
  isGoalAchieved?: boolean;
  isChallengeCompleted?: boolean;
}

export interface Contents {
  INFO_PAGE: InfoPage;
  HOME: Home;
  CORE_SETTING: CoreSetting;
  DASHBOARD: Dashboard;
  WAIVER?: { waiver: string };
}

export interface VirtualChallengeTeam {
  id?: string;
  challengeId: string;
  name: string;
  ragnarTeamId?: string;
  profileId: string;
  maxDays?: number;
  startDate?: string;
  isChallengeCompleted?: boolean;
  endDate?: string;
  isGoalAchieved?: boolean;
  isHalfwayCompleted?: boolean;
  completedAt?: Date;
  teamName?: string;
  total_run?: number;
}

export interface VirtualChallengeMember {
  id?: string;
  challengeId: string;
  challengeTeamId: string;
  activityStreak?: number;
  profileId: string;
  isResultSeen?: boolean;
  email: string;
  role: string;
  content?: unknown;
  waiverSnapshot?: string;
  isGoalAchieved?: boolean;
  achieved_run?: number;
}

export interface VirtualChallengeInvites {
  challengeId: string;
  challengeTeamId: string;
  profileId?: string;
  email: string;
  status?: string;
  joinedDate?: string;
  message?: string;
  challenge?: unknown;
  challengeTeam?: unknown;
}

export interface ECommerce {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  image_url: string;
  type: string;
  price: number;
  shipping: number;
  discount: number;
  content: Content;
  sort: number;
}

export class VirtualChallengeOrder {
  subTotal: number;
  discounts: number;
  total: number;
  shippingCharges: number;
}

export interface VirtualChallengeLeaderBoard {
  totalMembers: number;
  myPosition: number;
  myRun: number;
  myRank: number;
  maxRun: number;
  minRun: number;
  avgRun: number;
  myMilePercentage: number;
  myRankPercentage: number;
  challengeMemberData: VirtualChallengeLeaderBoardMemberData[];
  rankPocessedData?: RankPocessedData;
  existingMember: ExistingMember;
  safeState?: string;
  challengeMemberId?: string;
}

export interface RankPocessedData {
  SAFE: Safe;
  MAYBE_SAFE: Safe;
  NOT_SAFE: Safe;
}

export interface Safe {
  title: string;
  value: string;
  description: string;
  currently: string;
  data: [];
  totalPlayers: number;
}

export interface ExistingMember {
  currentSafeStatus: string;
  firstName: string;
}
export interface VirtualChallengeLeaderBoardMemberData {
  challengeMemberId: string;
  total_run: number;
  firstName: string;
  lastName: string;
  rank: number;
  status: 'SAFE' | 'NOT_SAFE' | 'MAYBE_SAFE';
}

export interface VirtualChallengeRunLogs {
  id: string;
  challengeId: string;
  challengeTeamId: string;
  challengeMemberId: string;
  logDate: string;
  type: string;
  unit: number;
  content: Content;
  stravaActivityId: string;
  isAssigned: null;
}

export interface VirtualChallengeOrder {
  challengeId: string;
  email: string;
  profileId: string;
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  tShirtSize: string;
  bornAt: string | Date | null;
  gender: string;
  phone: string;
  cardNumber: string;
  paymentToken: PaymentToken;
}

export interface PaymentToken {
  dataDescriptor: string;
  dataValue: string;
}
export interface UserChallengeInfo {
  activeChallenge: ChallengeDetails | null;
  cumulative: number;
  challenge_completed: number;
  runs_verified: number;
  carrier_kills: number;
  challenge_attempt: number;
  lastBadge: number | null;
  badges: Badges[];
  completedChallenge: ChallengeDetails[];
}

export interface ChallengeDetails {
  challengeId: string;
  challengeName: string;
  completed_date: string;
  cumulative: number;
  challenge_completed: number;
  runs_verified: number;
  carrier_kills: number;
  image: string;
  lastBadge: number | null;
}
export interface Badges {
  url: string;
}

interface Content {
  tag: string;
  bigText: string;
  includes: string[];
  isSoldOut: number;
  smallText: string;
  description: string;
  soldOutDate: string;
  description2: string | null;
}
interface InfoPage {
  logo: string;
  title: string;
  waiver: string;
  subTitle: string;
  bannerImage: null;
  bannerVideo: string;
  ruleBigText: string;
  swagDetails: SwagDetails;
  getTheGear: string;
  feedback: string;
  motivateMe: string;
  ruleSmallText: string;
  challengeRules: ChallengeRule[];
  introQuestions: IntroQuestion[];
  registerBtnText: RegisterBtnText;
  termConditionLink: string;
  registrationCloseDate: string;
  sponsoredBrand?: string;
  sponsoredBrandLink?: string;
}

interface SwagDetails {
  bigText: string;
  includes: string[];
  smallText: string;
  description: string;
}

interface ChallengeRule {
  image: string;
  title: string;
  identifier: string;
  description: string;
  mobileImage: string;
}

interface IntroQuestion {
  title: string;
  description: string;
}

interface RegisterBtnText {
  top: string;
  bottom: string;
}

interface Home {
  logoImage: string;
  description: null;
  highlightPoints: string[];
}

interface Dashboard {
  faqs: FAQ[];
  printableCalender: string;
}

interface FAQ {
  id: number;
  title: string;
  description: string;
}

interface CoreSetting {
  challengeTeamId: string;
  isInviteSendAllow: boolean;
  isTeamCreateAllow: boolean;
  activityRestriction: ActivityRestriction;
  isMemberPaymentCheck: boolean;
}

interface ActivityRestriction {
  allow: boolean;
  maxCount: number;
  maxMileLimit: number;
}

export interface AddedActivityCopy {
  type: string;
  addedActivity: AddActivity;
}
export interface AddActivity {
  id: string;
  challengeId: string;
  challengeTeamId: string;
  challengeMemberId: string;
  logDate: string;
  type: string;
  unit: number;
  content: Content;
  stravaActivityId: string;
  isAssigned: string;
  prevMile?: number;
  totalActivities?: number;
}
export interface GetChallengeNotification {
  id: string;
  challengeId: string;
  challengeTeamId: string;
  challengeMemberId: string;
  profileId: string;
  message: string | null;
  previousStatus: string;
  currentStatus: string;
  insertedOn: string;
  type: string;
  isRead: boolean;
  previousStatusDigit?: number;
  currentStatusDigit?: number;
  totalUnRead: number;
  logo: string;
}
