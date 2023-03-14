export const dashboardScreenMenu = [
  {
    label: 'Team Stats',
    value: 'teamstats',
    icon: 'iconm-dashbord',
  },
  {
    label: 'Activity Feed',
    value: 'activityFeed',
    icon: 'iconm-addrun',
  },
  {
    label: 'New Invite',
    value: 'newinvite',
    icon: 'iconm-add-invite',
  },
  {
    label: 'Ragnar Nation',
    value: 'ragnarnation',
    icon: 'iconm-ragnar_icon',
  },
];

export const show = {
  pageLoading: false,
  loading: false,
  activityButton: false,
  isChallengeStarted: false,
  isResultComplete: true,
  result: false,
  dashboardScreen: {
    teamstats: false,
    activityFeed: false,
    newinvite: false,
    ragnarnation: false,
  },
};

export const screens = {
  teamstats: 'teamstats',
  activityFeed: 'activityFeed',
  newinvite: 'newinvite',
  ragnarnation: 'ragnarnation',
};
