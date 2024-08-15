import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../../models/api/response';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.api;

  constructor(private http: HttpClient) {}

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error.error as Error);
  }

  public post<R, T>(url: string, data?: T): Observable<string> {
    url = this.apiUrl + url;
    return this.http.post<Response<R>>(url, data).pipe(
      map(({ message }) => message),
      catchError(this.handleError)
    );
  }

  public postWithReturnData<R, T>(url: string, data?: T): Observable<R> {
    url = this.apiUrl + url;
    return this.http.post<Response<R>>(url, data).pipe(
      map(({ data }) => data),
      catchError(this.handleError)
    );
  }

  public get<R>(url: string, content?: any): Observable<R> {
    url = this.apiUrl + url;
    let params = new HttpParams();

    if (content) {
      params = params.appendAll(content);
    }

    return this.http.get<R>(url, { params }).pipe(
      catchError(this.handleError)
    );
  }

  public put<R, T>(url: string, data?: T): Observable<string> {
    url = this.apiUrl + url;
    return this.http.put<Response<R>>(url, data).pipe(
      map(({ message }) => message),
      catchError(this.handleError)
    );
  }

  public putWithReturnData<R, T>(url: string, data?: T): Observable<R> {
    url = this.apiUrl + url;
    return this.http.put<Response<R>>(url, data).pipe(
      map(({ data }) => data),
      catchError(this.handleError)
    );
  }

  public delete<R>(url: string, body?: any): Observable<string> {
    url = this.apiUrl + url;
    return this.http.delete<Response<R>>(url, { body }).pipe(
      map(({ message }) => message),
      catchError(this.handleError)
    );
  }

  public patch<R, T>(url: string, data?: T): Observable<string> {
    url = this.apiUrl + url;
    return this.http.patch<Response<R>>(url, data).pipe(
      map(({ message }) => message),
      catchError(this.handleError)
    );
  }
}
