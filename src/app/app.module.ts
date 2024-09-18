import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDanisoftUtilsModule } from 'ngx-danisoft-utils';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';

import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { Auth0Interceptor } from './core/interceptors/auth0.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxDanisoftUtilsModule,
    NgbModule,
    ToastrModule.forRoot(),
    Auth0Module.forRoot({
      domain: 'dev-tf6rjjtc.auth0.com',
      clientId: 'WZNm59oARsrlUlcSjdDrxqRfM6DtmqSz',
      authorizationParams: {
        redirect_uri: window.location.origin + '/#/landing',
      },
    }),

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: Auth0Interceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
