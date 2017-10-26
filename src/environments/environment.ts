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
  clientID: "2a487cc09672bdb26ddb746512ecdbbbad7934793f0de53402afb7ca9ec07f9b",
  clientSecret: "4886aedfa49294393749b2db813c18f7096ee6eaa6e29f40e990e4788123988e",

  callbackURL: window.location.origin+ "/oauth/callback",

  segmentorURL: "https://124.190.240.112:8080/api/segment/url"
};
