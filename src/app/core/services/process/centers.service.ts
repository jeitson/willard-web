import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CentersService {
  constructor(private _api: ApiService) {}

  // Crear un nuevo centro de acopio
  createCollectionSite(content: any): Observable<any> {
    return this._api.post('collection-sites', content);
  }

  // Obtener el listado de centros de acopio con opción de paginación
  getCollectionSites(params?: any): Observable<any> {
    return this._api.get('collection-sites', params);
  }

  // Obtener un centro de acopio por su ID
  getCollectionSiteById(id: string): Observable<any> {
    return this._api.get(`collection-sites/${id}`);
  }

  // Actualizar un centro de acopio existente
  updateCollectionSite(id: string, content: any): Observable<any> {
    return this._api.put(`collection-sites/${id}`, content);
  }

  // Eliminar un centro de acopio por su ID
  deleteCollectionSite(id: string): Observable<any> {
    return this._api.delete(`collection-sites/${id}`);
  }

  // Cambiar el estado de un centro de acopio
  changeCollectionSiteStatus(id: string): Observable<string> {
    const url = `collection-sites/${id}/change-status`;
    return this._api.patch(url);
  }
}
