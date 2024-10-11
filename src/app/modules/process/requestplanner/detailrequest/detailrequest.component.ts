import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RequestsService } from 'src/app/core/services/requests/requests.service';

@Component({
  selector: 'wlrd-detailrequest',
  templateUrl: './detailrequest.component.html',
  styleUrls: ['./detailrequest.component.scss']
})
export class DetailrequestComponent {

  @Input() requestId: string | null = null;

  constructor(private route: ActivatedRoute,  private  _service: RequestsService) {}
  listData: any = [];

  ngOnInit(): void {
    // Obtener el parámetro 'id' de la ruta
    if(this.requestId !== null && this.requestId !== ''){
      this.listData = JSON.parse(this.requestId);
    } else{
      this.route.params.subscribe(params => {
        this.requestId = params['id']; // El '+' convierte el string a número
        console.log('Request ID:', this.requestId); // Verifica si se obtiene correctamente

        // Llamar a getData solo si requestId es válido
        if (this.requestId) {
          this.getData();
        }
      });
    }
  }

  getData() {
    this._service.getSolicitudById(this.requestId).subscribe((response: any) => {
      this.listData =response.data
      console.log(this.listData);
      // Aquí puedes manejar la respuesta según tus necesidades
    });
  }
}
