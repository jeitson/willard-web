import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private _api: HttpClient) {}

	getMenu(): Observable<any> {
    return this._api.get<any>('assets/json/menu.json');
  }

}
