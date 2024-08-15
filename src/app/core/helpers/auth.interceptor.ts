import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Auth0Service } from '../services/auth0.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth0Service: Auth0Service,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth0Service.accessToken$.pipe(
      switchMap((token) => {
        if (token && this.auth0Service.isTokenExpiring(token, 30)) {
          return this.auth0Service.renewTokenSilently().pipe(
            switchMap((newToken) => {
              //console.log('newToken::', newToken);
              const headers = req.headers.set(
                'Authorization',
                `Bearer ${newToken}`
              );
              const authReq = req.clone({ headers });
              return next.handle(authReq);
            }),
            catchError((error) => {
              this.router.navigate(['/cerrar_sesion']);
              return throwError(error);
            })
          );
        } else if (token) {
          const headers = req.headers.set('Authorization', `Bearer ${token}`);
          const authReq = req.clone({ headers });
          return next.handle(authReq);
        } else {
          return next.handle(req);
        }
      }),
      catchError((error) => {
        //this.router.navigate(['/cerrar_sesion']);
        return throwError(error);
      })
    );
  }
}
