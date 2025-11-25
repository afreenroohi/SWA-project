// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  postLogoutUrl: 'https://procurementtest.mwan.sa:3000/',
  apiUrl: 'http://localhost:5000/',
  adfsendpoint: 'https://sspr.mwan.gov.sa/sso/oauth/d92acd855f91fb546784e465b76e0f9e7b5aa4ec',
  clientId: 'yJBRRZP5lquMgCtgO8kIT7mGK',
  clientSecret: 'rfxcHGkuegNC09Gl7YwCUKyKrgneL_t0dQ8odVcO',
  scope: 'openid email profile',
  token: 'S0FBUl9URUNITklDOk13YW5AVGVjaEA1NDMyMQ==',
  downloadUrl: 'http://localhost:5000/api/downloadfile/',
  filenetUrl: 'http://API-Gateway-DEV:5555/ws/SIDF_FileNet/1/',
  testlogin: true,
  sapCreateSesUrl:'https://s4hdev.monjiz.mwan.gov.sa/sap/bc/ui2/flp?sap-client=200&sap-language=EN#ZML81N-create',
  sapCreateSesArUrl: 'https://s4hdev.monjiz.mwan.gov.sa/sap/bc/ui2/flp?sap-client=200&sap-language=AR#ZML81N-create'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
