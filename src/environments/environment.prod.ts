export const environment = {
  production: true,

  baseURL: 'https://app.alveo.edu.au',
  loginURL: '/oauth/authorize',

  clientID: 'b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084',
  clientSecret: 'e533af5728a1334a089d9b446bda3204be4d59785734981832956b446cfbf64b',

  callbackURL: window.location.origin + '/oauth/callback',

  devTools: false,

  mainTranscriber: 'alveo',

  segmentorURL: '/api/segment/url'
};
