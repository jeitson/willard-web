// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const isProd = true;
const isRedirect = isProd;
export const environment = {
  production: isProd,
  app_name: 'portalCli',
  authPrefix: 'portalCli',
  appKey: 'woo',
  auth0: {
    domain: 'woomi.us.auth0.com',
    clientId: 'J6y4rM1qTAZRL1vhPXetaTc1NLPz7l8P',
    audience: 'https://woomi.bateriaswillard.com/',
    redirect_uri: isRedirect
      ? `${window.location.origin}/portalCli`
      : `${window.location.origin}`,
    responseType: 'code',
    leeway: 60,
    prompt: 'consent',
    scope:
      'openid profile username email picture user_metadata app_metadata read:invoices read:orders read:post_consumer_certificates read:user_association write:post_consumer_certificates',
  },
  woomi: {
    domain: isProd
      ? 'https://woomi.bateriaswillard.com'
      : 'http://127.0.0.1:3200',
    motorBD: 'IbesV9',
    auth: isProd
      ? 'https://auth4u.bateriaswillard.com'
      : 'http://127.0.0.1:3200',
  },
  socket: {
    domain: isProd
      ? 'https://woomi.bateriaswillard.com'
      : 'http://127.0.0.1:3200',
  },
  file: {
    domain: 'https://files.bateriaswillard.com',
    username: 'sistemas',
    password: 'willard1505',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
