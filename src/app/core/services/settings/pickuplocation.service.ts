import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PickuplocationService {

  constructor(private _api: ApiService) {}

  // Cambiar el estado de un asesor
  changeConsultantStatus(id: any): Observable<any> {
    return this._api.patch(`consultants/${id}/change-status`);
  }
  
  // Crear un nuevo lugar de recogida
  createPickUpLocation(content: any): Observable<any> {
    return this._api.post('pick-up-locations', content);
  }
  
  // Obtener el listado de lugares de recogida con opción de paginación
  getPickUpLocations(): Observable<any> {
    return this._api.get('pick-up-locations');
  }
  
  // Obtener un lugar de recogida específico por su ID
  getPickUpLocationById(id: any): Observable<any> {
    return this._api.get(`pick-up-locations/${id}`);
  }
  
  // Actualizar un lugar de recogida existente por su ID
  updatePickUpLocation(id: any, content: any): Observable<any> {
    return this._api.put(`pick-up-locations/${id}`, content);
  }
  
  // Eliminar un lugar de recogida por su ID
  deletePickUpLocation(id: any): Observable<any> {
    return this._api.delete(`pick-up-locations/${id}`);
  }
  
  // Cambiar el estado de un lugar de recogida
  changePickUpLocationStatus(id: any): Observable<any> {
    return this._api.patch(`pick-up-locations/${id}/change-status`);
  }
  
}
