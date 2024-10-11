import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private _api: ApiService) {}

  getAudits(): Observable<any> {
    // Puedes pasar parámetros para la paginación o filtros si es necesario
    return this._api.get('audits');
  }

  getAuditById(id: any): Observable<any> {
    return this._api.get(`audits/${id}`);
  }
}
