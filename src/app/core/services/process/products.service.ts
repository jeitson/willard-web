import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _api: ApiService) {}

  // Crear un nuevo producto
  createProduct(content: any): Observable<any> {
    return this._api.post('products', content);
  }

  // Obtener el listado de productos con opción de paginación
  getProducts(params?: any): Observable<any> {
    return this._api.get('products', params);
  }

  // Obtener un producto por su ID
  getProductById(id: string): Observable<any> {
    return this._api.get(`products/${id}`);
  }

  // Actualizar un producto
  updateProduct(id: string, content: any): Observable<any> {
    return this._api.put(`products/${id}`, content);
  }

  // Eliminar un producto
  deleteProduct(id: string): Observable<any> {
    return this._api.delete(`products/${id}`);
  }

  // Cambiar el estado de un producto
  changeProductStatus(id: string): Observable<any> {
    return this._api.patch(`products/${id}/change-status`);
  }
}
