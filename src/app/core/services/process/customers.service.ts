import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private _api: ApiService) {}

  // Crear un nuevo cliente
  createClient(content: any): Observable<any> {
    return this._api.post('clients', content);
  }

  // Obtener el listado de clientes con opción de paginación
  getClients(): Observable<any> {
    return this._api.get('clients', );
  }

  // Obtener un cliente específico por su ID
  getClientById(id: any): Observable<any> {
    return this._api.get(`clients/${id}`);
  }

  // Actualizar un cliente existente por su ID
  updateClient(id: any, content: any): Observable<any> {
    return this._api.put(`clients/${id}`, content);
  }

  // Eliminar un cliente por su ID
  deleteClient(id: any): Observable<any> {
    return this._api.delete(`clients/${id}`);
  }

  changeClientStatus(id: any): Observable<any> {
    return this._api.patch(`clients/${id}/change-status`);
  }


}
