export const environment = {
  production: true,

  baseURL: "https://www.alveo.edu.au",
  loginURL: "http://www.alveo.edu.au/oauth/authorize",

  clientID: "b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084",
  clientSecret: "e533af5728a1334a089d9b446bda3204be4d59785734981832956b446cfbf64b",

  callbackURL: window.location.origin+ "/oauth/callback",

  // TODO: production segmentorURL
  segmentorURL: "http://127.0.0.1:8080/api/segment/url"
};
