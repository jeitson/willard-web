import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreditnotesService {
 constructor(private _api: ApiService) {}

  // Obtener el listado de transportadores con opción de paginación
  getCreditNotes(id: any): Observable<any> {
    return this._api.get('notes-credits', {transporterId : id});
  }
}
