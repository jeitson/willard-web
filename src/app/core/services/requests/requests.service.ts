import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private _api: ApiService) {}

  // Método para crear una nueva solicitud
  createSolicitud(solicitud: any): Observable<any> {
    return this._api.post('collection-request', solicitud);
  }

  // Método para listar todas las solicitudes
  listSolicitudes(): Observable<any> {
    return this._api.get(`collection-request`);
  }

  completeSolicitud(id: any, content: any): Observable<any> {
    return this._api.patch(`collection-request/${id}`, content);
  }

  // Método para obtener una solicitud por su ID
  getSolicitudById(id: any): Observable<any> {
    return this._api.get(`collection-request/${id}`);
  }

  // Método para actualizar una solicitud
  updateSolicitud(id: any, content: any): Observable<any> {
    return this._api.put(`collection-request/${id}`, content);
  }

  // Método para eliminar una solicitud
  deleteSolicitud(id: any): Observable<any> {
    return this._api.delete(`collection-request/${id}`);
  }

  // Método para rechazar una solicitud
  rejectSolicitud(id: any): Observable<any> {
    return this._api.post(`collection-request/${id}/reject`, {});
  }

  // Método para aprobar una solicitud
  approveSolicitud(id: any): Observable<any> {
    return this._api.post(`collection-request/${id}/approve`, {});
  }

  // Método para cancelar una solicitud
  cancelSolicitud(id: any): Observable<any> {
    return this._api.post(`collection-request/${id}/cancel`, {});
  }
}
