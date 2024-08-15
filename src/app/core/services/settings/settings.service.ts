import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private _api: ApiService) {}



// Crear hijos de catálogos
createCatalogChild(catalog: any): Observable<any> {
  return this._api.post('catalogs', catalog);
}

// Actualizar un catálogo
updateCatalog(id: any, catalog: any): Observable<any> {
  return this._api.put(`catalogs/${id}`, catalog);
}

// Eliminar un hijo de catálogo
deleteCatalogChild(id: any): Observable<any> {
  return this._api.delete(`catalogs/${id}`);
}

// Obtener un hijo de catálogo por su ID
getCatalogChildById(id: any): Observable<any> {
  return this._api.get(`catalogs/${id}`);
}

// Cambiar el orden de un catálogo
changeCatalogOrder(id: any, order: any): Observable<any> {
  return this._api.put(`catalogs/${id}/change-order/${order}`, {});
}

// Cambiar el padre de un catálogo
changeCatalogParent(id: any, parentId: any): Observable<any> {
  return this._api.put(`catalogs/${id}/change-parent/${parentId}`, {});
}

// Cambiar el estado de un catálogo
changeCatalogStatus(id: any, status: any): Observable<any> {
  return this._api.put(`catalogs/${id}/change-status`, { status });
}

// Obtener hijos por su llave (KEY)
getCatalogChildrenByKey(key: string): Observable<any> {
  return this._api.get(`catalogs/key/${key}`);
}

// Obtener hijos por su llave (KEY) y su padre
getCatalogChildrenByKeyAndParent(key: string, parentId: any): Observable<any> {
  return this._api.get(`catalogs/key/${key}/parent/${parentId}`);
}

// Buscar hijos de catálogos por sus padres
searchCatalogChildrenByParents(parents: any[]): Observable<any> {
  return this._api.post('catalogs/search-by-keys', { parents });
}
}
