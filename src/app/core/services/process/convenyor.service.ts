import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConvenyorService {
  constructor(private _api: ApiService) {}

  // Crear un nuevo transportador
  createTransportador(content: any): Observable<any> {
    return this._api.post('transporters', content);
  }

  // Obtener el listado de transportadores con opción de paginación
  getTransportadores(): Observable<any> {
    return this._api.get('transporters');
  }

  // Obtener un transportador por su ID
  getTransportadorById(id: any): Observable<any> {
    return this._api.get(`transporters/${id}`);
  }

  // Actualizar un transportador
  updateTransportador(id: any, content: any): Observable<any> {
    return this._api.put(`transporters/${id}`, content);
  }

  // Eliminar un transportador
  deleteTransportador(id: any): Observable<any> {
    return this._api.delete(`transporters/${id}`);
  }

  // Cambiar el estado de un transportador
  changeTransportadorStatus(id: any): Observable<any> {
    return this._api.patch(`transporters/${id}/change-status`);
  }
}
