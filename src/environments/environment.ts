export const environment = {
  production: false,

  baseURL: 'https://app.alveo.edu.au',
  loginURL: '/oauth/authorize',

  clientID: '2a487cc09672bdb26ddb746512ecdbbbad7934793f0de53402afb7ca9ec07f9b',
  clientSecret: '4886aedfa49294393749b2db813c18f7096ee6eaa6e29f40e990e4788123988e',

  callbackURL: window.location.origin + '/oauth/callback',

  devTools: true,

  mainTranscriber: 'alveo',

  segmentorURL: 'https://124.190.240.112:8080/api/segment/url'
};
