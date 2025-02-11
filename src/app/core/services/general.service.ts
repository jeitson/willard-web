import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private _api: HttpClient, private _service:ApiService) {}

	getMenu(): Observable<any> {
    return this._api.get<any>('assets/json/menu.json');
  }


    // Método para enviar el archivo a la ruta especificada
    uploadFile(file: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', file); // 'file' es el nombre del campo que espera el backend
  
      // Enviar el archivo a la ruta especificada
      return this._service.post('registro', formData);
    }

    // Obtener el listado de asesores con opción de paginación
    getConsultantsTransp(params: any): Observable<any> {
      return this._service.get(`registro?page=${params}`);
    }

    UpdateGuia(params: any, data:any): Observable<any> {
      return this._service.patch(`registro/guia/${params}`, data);
    }

}
