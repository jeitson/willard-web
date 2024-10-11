import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private _api: ApiService) {}

	// allRoles(): Observable<any> {
	// 	return this._api.get('options/study_level/list');
	// }

}
