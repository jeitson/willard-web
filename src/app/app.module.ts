import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDanisoftUtilsModule } from 'ngx-danisoft-utils';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxDanisoftUtilsModule,
    NgbModule,
    Auth0Module.forRoot({
      domain: 'dev-tf6rjjtc.auth0.com',
      clientId: 'WZNm59oARsrlUlcSjdDrxqRfM6DtmqSz',
      authorizationParams: {
        redirect_uri: window.location.origin + '/#/landing',
      },
    }),

  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
