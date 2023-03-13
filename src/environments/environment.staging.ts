export const environment = {
  production: false,
  BASE_URL: '/',
  SENTRY_STAGE: 'staging',
  RAGNAR_CHALLENGE: 'https://challenge-dev-api.ragnarlife.com',

  DOMESTIC_URL: 'https://dev.runragnar.com',
  CMS_API: 'https://dev-api.ragnarlife.com',

  CHALLENGE_REDIRECTION: 'https://dev.runragnar.com/31dc/challenge/home',
  CHALLENGE_31_DC_LANDING: 'https://dev.runragnar.com/31dc/challenge/info?challengeId=31_day_2022',

  STRAVA: {
    CLIENT_ID: '44945',
    CLIENT_SECRET: '9bd10a813cf3f32714751e09457cec53ce7f2aa4',
    API_URL: 'https://www.strava.com/api/v3',
  },

  AUTHORIZE_NET: {
    CLIENT_KEY: '97gntGyYaD37896TFRgm623wfQ7JgcgqU8euETHHrE4wY2SFsfqZWm9W5B9j7we8',
    API_LOGIN_ID: '68W5nXmttLh',
    URL: 'https://jstest.authorize.net/v1/Accept.js',
  },

  GOOGLE_ANALYTICS: {
    UA_TOKEN: 'UA-XXXXXXX-X',
    GTM_TOKEN: 'GTM-XXXXXXX',
  },

  MAP_BOX: {
    accessToken: 'pk.eyJ1Ijoicm9zcy1yYWduYXIiLCJhIjoiY2p4dmZlM2ZuMDQwbjNocDhhcmpidGdpYSJ9.lwhguqyAGmAjoeqw61q_kA',
  },

  RCMS_EVENT_API: {
    RAGNAR_HUB_ADMIN_BASEURL: 'https://s3-us-west-2.amazonaws.com/ragnar-hub-ui-v2/index.html',
    RAGNAR_HUB_USER_BASEURL: 'https://s3-us-west-2.amazonaws.com/ragnar-hub-ui-v2/index.html',
    TEAM_CENTER: 'https://7p8xe0mov8.execute-api.us-west-2.amazonaws.com/staging',
    REG_CONFIG: 'https://jormc3na7h.execute-api.us-west-2.amazonaws.com/staging',
    PROMOCODES: 'https://bmhiutei5j.execute-api.us-west-2.amazonaws.com/staging',
    REGISTRATION: 'https://496pwdxkk9.execute-api.us-west-2.amazonaws.com/staging',
    JOBS: 'https://bh1fqbdu13.execute-api.us-west-2.amazonaws.com/staging',
    TEAMS: 'https://xcs4azisal.execute-api.us-west-2.amazonaws.com/staging',
    PROFILES_API: 'https://zvoj73jyy4.execute-api.us-west-2.amazonaws.com/staging',
    CHALLENGE: 'https://p8yowt3imj.execute-api.us-west-2.amazonaws.com/staging',
    GLAMPING: 'https://5ygdncaqj3.execute-api.us-west-2.amazonaws.com/staging',
    KEY: 'b7f5361ab446b480f62d2774ef174b30c4f2e5ae109758382ce300037e6d80eaaaefba0621ef046f2d3b0ed0',
  },

  AFFIRM_CONFIG: {
    public_api_key: '06I5BBH3EKH3YNWG',
    script: 'https://cdn1-sandbox.affirm.com/js/v2/affirm.js',
  },

  SENTRY: {
    STAGE: 'staging',
    KEY: 'https://b78ad38a697046e2abf33c353d8171cc@o545709.ingest.sentry.io/5669987',
  },

  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyDuAppp96NYe2ioSr50IOWS-Odx0RCZKpA',
    authDomain: 'challenge-alpha-33bf8.firebaseapp.com',
    databaseURL: 'https://challenge-alpha-33bf8.firebaseio.com',
    projectId: 'challenge-alpha-33bf8',
    storageBucket: 'challenge-alpha-33bf8.appspot.com',
    messagingSenderId: '389519402198',
    appId: '1:389519402198:web:041e39daea7e56bb',
  },
  
  SSR_PORT: 4000,
  SERVER_URL: '15.207.54.71'
};
