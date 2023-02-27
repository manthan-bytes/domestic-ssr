import { query as GraphQLQuery } from 'gql-query-builder';

export const eventDetailMapFields = [
  'id',
  'name',
  'coming_soon',
  'type',
  'alias',
  'start_date',
  'end_date',
  'end_city',
  'start_city',
  'country',
  'registration_opens',
  'registration_closes',
  'meta_description',
  'prelaunch_url',
  'waitlist_url',
  'waitlist_flag',
  {
    files: [
      'banner',
      {
        photos: ['path'],
      },
    ],
  },
  {
    reg_system: ['eventURL'],
  },
];

export const raceDataFields = [
  'id',
  'intro',
  'juicer_id',
  'start_date',
  'end_date',
  'alias',
  'start_time_posted',
  'volunteer_start_date',
  'volunteer_end_date',
  'end_city',
  'start_city',
  'type',
  'registration_opens',
  'registration_closes',
  'coming_soon',
  'waitlist_flag',
  'prelaunch_flag',
  'lottery_flag',
  'reg_source',
  'video_url',
  'name',
  'lottery_msg',
  'waitlist_url',
  'prelaunch_url',
  'charity',
  'fb_url',
  'change_fee_20usd_start',
  'team_name_change_deadline',
  'pay_for_volunteers_deadline',
  'final_online_runner_invite_deadline',
  'is_registartion_close',
  {
    reg_system: ['eventURL'],
  },
  {
    files: ['banner', 'logo_white', 'race_bible'],
  },
  {
    director: [
      'first_name',
      'last_name',
      'image',
      {
        facts: ['id', 'value', 'sort'],
      },
      'description',
    ] /*TODO: commented facts due to server error */,
  },
  {
    pricing: ['name', 'label', 'teamSize', 'teamPrice', 'startDate', 'endDate'],
  },
  {
    social_results: ['id', 'year', 'url', 'sort'],
  },
  {
    social_photos: ['id', 'year', 'url', 'sort'],
  },
  {
    captains_tools: ['id', 'title', 'value_type', 'value', 'type'],
  },
  {
    trips: ['id', 'race_id', 'title', 'type', 'value', 'sort'],
  },
  {
    sponsors: ['name', 'logo_white', 'url', 'id', 'trail_official', 'relay_official', 'isActive', 'slug'],
  },
  {
    registration_close_reason: ['title', 'description'],
  },
];

export const datesAndUpdatesField = ['id', 'favourite', 'create_date', 'update_date', 'content', 'image', 'video_url'];

export const courseDataField = [
  'id',
  'name',
  'type',
  'distance_units',
  'village',
  'alias',
  {
    files: [
      'racebook',
      {
        photos: ['path'],
      },
    ],
  },
  {
    legs: [
      'name',
      'description',
      'notes',
      'leg_number',
      'distance_km',
      'difficulty',
      'distance',
      'elevation_gain',
      'elevation_loss',
      'elevation_gain_m',
      'elevation_loss_m',
      'van_support',
      'blackloop',
      'ragnar_leg',
      'turn_by_turn',
      'van_directions',
      {
        points: ['lat', 'lon', 'ele'],
      },
      {
        end_point: ['lat', 'long'],
      },
      {
        start_point: ['lat', 'long'],
      },
      {
        exchange_address: ['name', 'address_1', 'city', 'state', 'country', 'postal_code', 'latitude', 'longitude', 'note'],
      },
    ],
  },
  {
    exchanges: ['name', 'photo', 'description'],
  },
];

export const teamcenterDataField = [
  'id',
  'in_migration',
  'volunteer_contact_email',
  'alias',
  'check_in_waiver',
  'venue_check_in_waiver',
  'race_check_in_confirmation',
  {
    legs: ['leg_number', 'distance', 'distance_km', 'difficulty'],
  },
  {
    updates: [
      'id',
      'race_id',
      'title',
      'update_date',
      'create_date',
      'content',
      'image',
      'video_url',
      'favourite',
      / TODO: GQL Api issue for below fields /,
      /* 'create_date',
      'update_date', */
    ],
  },
  {
    files: [
      'id',
      'race_id',
      'logo',
      'logo_white',
      'training_badge',
      'finisher_badge',
      'map',
      'map_preview',
      'banner',
      'tile',
      'racebook',
      'safety_handbook',
      'raceday_handbook',
      'ultrateams_handbook',
      'hold_times',
      'volunteer_packet',
      'race_bible',
      'race_checkin_safety_video',
      'race_covid_safety_video',
      {
        photos: ['path'],
      },
    ],
  },
];

export const planYourTrip = [
  'id',
  {
    files: ['banner', 'logo_white'],
  },
  {
    travel: ['id', 'name', 'content', 'sort'],
  },
];

export const fetchRaceList = GraphQLQuery({
  operation: 'fetchRaceList',
  fields: [
    'id',
    'name',
    'type',
    'country',
    'alias',
    'region',
    'coming_soon',
    'start_date',
    'end_date',
    'blackloop_flag',
    'lat',
    'lng',
    'start_city',
    'end_city',
    'start_state',
    'waitlist_flag',
    {
      files: ['tile'],
    },
  ],
});

export const fetchRaceData = (id, fields: string[]) =>
  GraphQLQuery({
    operation: `fetchRaceByIdOrSlug(id:"${id}")`,
    fields,
  });

export const fetchRaceUpdates = (id, fields: string[]) =>
  GraphQLQuery({
    operation: `getRaceUpdates(raceId:${id})`,
    fields,
  });

export const getAllSponsors = GraphQLQuery({
  operation: 'getSponsors',
  fields: [
    'id',
    'name',
    'featured',
    'logo',
    'url',
    'logo_white',
    'logo_black',
    'home_trail',
    'home_trail_sort',
    'home_relay',
    'home_relay_sort',
    'trail_supporting',
    'trail_official',
    'slug',
    'relay_supporting',
    'relay_official',
    'sort',
    'description',
  ],
});

export const SponsorBySlug = (slug: string, fields: string[]) => {
  return GraphQLQuery({
    operation: `getSponsorBySlug(slug:"${slug}")`,
    fields,
  });
};
