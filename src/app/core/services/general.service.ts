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

	getImageDataUrlFromLocalPath1(localPath: string): Observable<string> {
		return new Observable<string>(observer => {
			const canvas = document.createElement(
				'canvas',
			) as HTMLCanvasElement;
			const img = new Image();
			img.onload = () => {
				canvas.height = img.height;
				canvas.width = img.width;

				const context = canvas.getContext('2d');
				if (context) {
					context.drawImage(img, 0, 0);
					observer.next(canvas.toDataURL('image/png'));
					observer.complete();
				} else {
					observer.error(
						'No se pudo obtener el contexto 2D del canvas',
					);
				}
			};
			img.onerror = () => observer.error('Imagen no disponible');
			img.src = localPath;
		});
	}
    // Método para enviar el archivo a la ruta especificada
    uploadFile(file: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', file); // 'file' es el nombre del campo que espera el backend

      // Enviar el archivo a la ruta especificada
      return this._service.post('transporter-travel', formData);
    }

    // Obtener el listado de asesores con opción de paginación
    getConsultantsTransp(params: any): Observable<any> {
      return this._service.get(`transporter-travel?page=${params}`);
    }

    UpdateGuia(params: any, data:any): Observable<any> {
      return this._service.patch(`transporter-travel/route/${params}`, data);
    }
    

}

