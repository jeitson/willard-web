import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private _router: Router, private _toastr: ToastrService) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err: HttpErrorResponse) => {
				// Obtiene la URL de la solicitud fallida
        const url = err.url ? err.url.split('api')[1]?.split('?')[0] : 'URL desconocida';
				// Evalúa el status code y ejecuta la lógica correspondiente
				switch (err.status) {
					case 0:
						this._toastr.info(err.statusText, 'Información');
						break;
					case 401:
						// Manejo de error 401 (Unauthorized)
						this._toastr.info('info','Nos vemos :) Tu sesión ha expirado');
						sessionStorage.clear();
						this._router.navigate(['login']);
						break;
          case 500:
						// Manejo de error 502 (Bad Gateway)
						this._toastr.error(`${ err.error.message || err.message} in service: ${url}`, 'Error 500');
						break;
          case 501:
              // Manejo de error 502 (Bad Gateway)
              this._toastr.error(`${ err.error.message || err.message} in service: ${url}`, 'Error 500');
              break;
					case 502:
						// Manejo de error 502 (Bad Gateway)
						this._toastr.error(`${ err.error.message || err.message} in service: ${url}`, 'Error 500');
						break;
					case 403:
						// Manejo de error 403 (Forbidden)
						this._toastr.warning(err.error.message || err.message, 'Error 403');
						break;
					case 400:
						// Manejo de error 400 (Bad Request)
						this._toastr.error(err.error.message || err.message, 'Error 400');
						break;
					case 404:
						// Manejo de error 404 (Not Found)
						this._toastr.error(err.error.message || err.message, 'Error 404');
					  break;

					default:
            this._toastr.error(err.error.message || err.message, `Error ${err.status}`);
						break;
				}

				// Retorna el error como un observable para que pueda ser manejado por el llamador
				const error = err.error.message || err.statusText;
				return throwError(error);
			})
		);
	}
}
