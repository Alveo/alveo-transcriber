// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  baseURL: "https://staging.alveo.edu.au",
  loginURL: "https://staging.alveo.edu.au/oauth/authorize",

  // Internal Binding
  //clientID: "5f891b901fd60f3c0dd3b81a2376491b6cb092b4de77bdc2d7c49362e8d3d02b";
  //clientSecret: "7584a0029874541e7bef236cd6f1634e6c6c0131b5537f57145bfe6473409d40";
  
  // External Binding
  clientID: "b1692ca827a959f62a9b79e0eb471c9fdc3e818c33c976076f7948101ba23084",
  clientSecret: "e533af5728a1334a089d9b446bda3204be4d59785734981832956b446cfbf64b",

  callbackURL: window.location.origin+ "/oauth/callback",

  segmentorURL: "http://127.0.0.1:8080/api/segment/url"
};
