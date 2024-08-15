import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  private _accessTokenSubject = new BehaviorSubject<string | null>(null);
  private _auth0HeadersSubject = new BehaviorSubject<HttpHeaders | null>(null);
  private _auth0HeadersByFileSubject = new BehaviorSubject<HttpHeaders | null>(
    null
  );

  private _auth0Headers$: HttpHeaders | null = null;
  private _auth0HeadersByFile$: HttpHeaders | null = null;

  constructor(private auth: AuthService) {
    // this.getUserDetails();
    // this.initializeAccessToken();
  }

  // Getter para accessToken$
  get accessToken$(): Observable<string | null> {
    return this._accessTokenSubject.asObservable();
  }

  // Getter para auth0Headers$
  get auth0Headers$(): Observable<HttpHeaders | null> {
    return this._auth0HeadersSubject.asObservable();
  }
  get auth0Headers(): HttpHeaders {
    return this._auth0Headers$ || new HttpHeaders();
  }

  // Getter para auth0HeadersByFile$
  get auth0HeadersByFile$(): Observable<HttpHeaders | null> {
    return this._auth0HeadersByFileSubject.asObservable();
  }

  get auth0HeadersByFile(): HttpHeaders {
    return this._auth0HeadersByFile$ || new HttpHeaders();
  }

  // Getter para isAuthenticated$
  get isAuthenticated$(): Observable<boolean> {
    return this.auth.isAuthenticated$;
  }

  private initializeAccessToken(): void {
    this.auth.getAccessTokenSilently().subscribe(
      (token) => {
        this.updateAccessToken(token);
      },
      (err) => {
        console.error('Error getting access token', err);
      }
    );
  }

  private updateAccessToken(token: string): void {
    this._accessTokenSubject.next(token);
    this._auth0HeadersSubject.next(
      new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      })
    );
    this._auth0HeadersByFileSubject.next(
      new HttpHeaders({
        enctype: 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      })
    );
  }

  getAccessTokenSilently(): Observable<string> {
    return from(this.auth.getAccessTokenSilently()).pipe(
      tap((token) => this.updateAccessToken(token))
    );
  }

  getTokenExpiration(token: string): moment.Moment {
    const decoded: any = jwtDecode(token);
    return moment.unix(decoded.exp); // Decoded expiration time is in seconds
  }

  getTimeUntilExpiration(token: string): number {
    const expiration = this.getTokenExpiration(token);
    const now = moment();
    return expiration.diff(now); // Returns the difference in milliseconds
  }

  isTokenExpiring(token: string, bufferTimeInMinutes: number = 5): boolean {
    const timeUntilExpiration = this.getTimeUntilExpiration(token);
    const bufferTime = bufferTimeInMinutes * 60 * 1000; // Buffer time in milliseconds
    //console.log(`timeUntilExpiration:: ${timeUntilExpiration} , bufferTime:: ${bufferTime}`);
    return timeUntilExpiration < bufferTime;
  }

  renewTokenSilently(): Observable<string> {
    return this.getAccessTokenSilently().pipe(
      catchError((error) => {
        console.error('Error renewing token', error);
        return throwError(() => new Error('Token could not be renewed'));
      })
    );
  }



  getUser(){
    return  this.auth.user$;
  }

  async isAuthenticated(){
    return  this.auth.isAuthenticated$;
  }

  logout() {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }

  login() {
    this.auth.loginWithRedirect({
      appState: { target: environment.auth0.redirect_uri },
    });
  }
}
