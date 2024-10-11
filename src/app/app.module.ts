import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule as Auth0Module } from '@auth0/auth0-angular';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { Auth0Interceptor } from './core/interceptors/auth0.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { NgxDanisoftUtilsModule } from 'ngx-danisoft-utils';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // HttpClientModule,
    NgxDanisoftUtilsModule,
    // NgbModule,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
