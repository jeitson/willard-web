import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private _api: ApiService) {}

  allUsers(): Observable<any> {
		return this._api.get('users');
	}

  createUser(content: any): Observable<any> {
		return this._api.post('users', content);
	}
  listUserId(id: any): Observable<any> {
		return this._api.get(`users/${id}`);
	}

  updateUser(id: any, content: any): Observable<any> {
		return this._api.put(`users/${id}`, content);
	}
}
