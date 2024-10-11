import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private _api: ApiService) {}

  allRoles(): Observable<any> {
		return this._api.get('roles');
	}
   // Método para crear un nuevo rol
   createRol(rol: { name: string; description: string }): Observable<any> {
    return this._api.post('roles', rol);
  }

	listRolesId(id: any): Observable<any> {
		return this._api.get(`roles/${id}`);
	  }
  updateRol(id: any, content: any): Observable<any> {
		return this._api.put(`roles/${id}`, content);
	}
}
