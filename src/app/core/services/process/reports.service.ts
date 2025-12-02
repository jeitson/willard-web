import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
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

  postCargueIRCJson(data: any): Observable<any> {
    return this._api.post('uploads/json/irc', data);
  }

  postCargueIRCExcel(data: FormData): Observable<any> {
    return this._api.post('uploads/excel/irc', data);
  }

  postCargueFacturasJson(data: any): Observable<any> {
    return this._api.post('uploads/json/invoices', data);
  }

  postCargueFacturasExcel(data: any): Observable<any> {
    return this._api.post('uploads/excel/invoices', data);
  }

  getCargues(tipo: 'irc' | 'invoices', params?: any): Observable<any> {
    return this._api.get(`uploads/${tipo}`, params);
  }

  getCargueById(tipo: 'irc' | 'invoices', id: string): Observable<any> {
    return this._api.get(`uploads/${tipo}/${id}`);
  }

  // ===============================
  // 🔹 CARGUES PRINCIPALES
  // ===============================

  // Obtener todos los cargues
  getAllUploads(params?: any): Observable<any> {
    return this._api.get('uploads', params);
  }

  // Filtrar registros IRC por tipo ('generated' | 'pending')
  getUploadsByType(type: string, params?: any): Observable<any> {
    return this._api.get(`uploads/filter/${type}`, params);
  }

  // Obtener IRC por número de acta grupal
  getIrcByActa(number: string): Observable<any> {
    return this._api.get(`uploads/acta/${number}`);
  }

  // Generar certificado individual para un IRC
  generateCertificateIndividual(id: number, data: any): Observable<any> {
    return this._api.post(`uploads/irc/${id}/certificate`, data);
  }

  // Generar certificado grupal para varios IRC
  generateCertificateGroup(data: any): Observable<any> {
    return this._api.post('uploads/irc/group/certificate', data);
  }

  // Anular certificado de un IRC
  annulCertificate(id: number, data?: any): Observable<any> {
    return this._api.post(`uploads/irc/${id}/annul`, data);
  }

  // Buscar certificados generados por rango de fecha
  getCertificatesByDate(params?: any): Observable<any> {
    return this._api.get('uploads/certificates/date', params);
  }

  getDelete(item: any): Observable<any> {
    return this._api.delete(`uploads/${item}`);
  }

  // ===============================
  // 🔹 DETALLES DE CARGUES
  // ===============================

  // Obtener detalles de facturas cargadas
  getInvoiceDetails(params?: any): Observable<any> {
    return this._api.get('uploads/details/invoices', params);
  }

  // Obtener detalles de registros IRC cargados
  getIrcDetails(params?: any): Observable<any> {
    return this._api.get('uploads/details/irc', params);
  }

  // Obtener cargues vinculados
  getCertificateData(params?: any): Observable<any> {
    return this._api.get('uploads/details/certificate-data', params);
  }

  reportFile(params: any): Observable<HttpResponse<Blob>> {
    return this._api.get(`reports/cruce-ph-recuperador`, {
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }
}
