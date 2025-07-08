import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

constructor(private _api: ApiService) {}

// Obtener todos los reportes con paginación
getReportesPH(params?: any): Observable<any> {
  return this._api.get('reporte_ph', params);
}

// Obtener un reporte por su ID
getReportePHById(id: string): Observable<any> {
  return this._api.get(`reporte_ph/${id}`);
}

// Consultar reportes por referencia PH de agencia
getReportePHAgencia(params?: any): Observable<any> {
  return this._api.get('reporte_ph/agencia', params);
}

// Reporte de Reciclaje de Baterías
getReporteReciclajeBaterias(params?: any): Observable<any> {
  return this._api.get('reports/battery-recycling', params);
}

postInformationCertificates(data: FormData): Observable<any> {
  return this._api.post('information-certificates', data);
}
getInformationCertificates(params?: any): Observable<any> {
  return this._api.get('information-certificates', params);
}


}
