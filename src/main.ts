/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAuth0 } from '@auth0/auth0-angular';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideAuth0({
//       domain: 'dev-tf6rjjtc.auth0.com',
//       clientId: 'WZNm59oARsrlUlcSjdDrxqRfM6DtmqSz',
//       authorizationParams: {
//         redirect_uri: window.location.origin + '/#/landing',
//       },
//     }),
//   ]
// });
