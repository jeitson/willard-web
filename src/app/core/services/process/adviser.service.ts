import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdviserService {

  constructor(private _api: ApiService) {}
  // Crear un nuevo asesor
createConsultant(content: any): Observable<any> {
  return this._api.post('consultants', content);
}

// Obtener el listado de asesores con opción de paginación
getConsultants(params?: any): Observable<any> {
  return this._api.get('consultants', params);
}

// Obtener un asesor por su ID
getConsultantById(id: string): Observable<any> {
  return this._api.get(`consultants/${id}`);
}

// Actualizar un asesor
updateConsultant(id: string, content: any): Observable<any> {
  return this._api.put(`consultants/${id}`, content);
}

// Eliminar un asesor
deleteConsultant(id: string): Observable<any> {
  return this._api.delete(`consultants/${id}`);
}

// Cambiar el estado de un asesor
changeConsultantStatus(id: string): Observable<any> {
  return this._api.patch(`consultants/${id}/change-status`);
}

}
