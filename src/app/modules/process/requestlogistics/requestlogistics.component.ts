import { Component } from '@angular/core';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
declare var $: any;

@Component({
  selector: 'wlrd-requestlogistics',
  templateUrl: './requestlogistics.component.html',
  styleUrls: ['./requestlogistics.component.scss'],
})
export class RequestlogisticsComponent {

  request = {
    specialPlanner: '',
    changeRetriever: '',
    transporter: '',
    driver: '',
    estimatedKG: 0,
    isSpecial: false, // Asegúrate de que este valor se actualice según sea necesario en tu aplicación
  };


  specialPlanners = [
    { name: 'Planeador 1', id: 1 },
    { name: 'Planeador 2', id: 2 },
    { name: 'Planeador 3', id: 3 },
    // Agrega más planeadores especiales según sea necesario
  ];

  retrievers = [
    { name: 'Recuperador 1', id: 1 },
    { name: 'Recuperador 2', id: 2 },
    { name: 'Recuperador 3', id: 3 },
    // Agrega más recuperadores según sea necesario
  ];

  transporters = [
    { name: 'Transportador 1', id: 1 },
    { name: 'Transportador 2', id: 2 },
    { name: 'Transportador 3', id: 3 },
    // Agrega más transportadores según sea necesario
  ];

  drivers = [
    { name: 'Conductor 1', id: 1 },
    { name: 'Conductor 2', id: 2 },
    { name: 'Conductor 3', id: 3 },
    // Agrega más conductores según sea necesario
  ];
  listsrequest: any[] = [];
  action = {name: 'LOGISTICA'}
  constructor(
    private _Customers: CustomersService,
    private _Conveyor: ConvenyorService,
    private _Settings: SettingsService,
    private _requests: RequestsService,
    private _pickUp: PickuplocationService
  ) {}
  ngOnInit(): void {
    this.getRequest();
  }
  getRequest() {
    this._requests.listSolicitudes('3').subscribe((response: any) => {
      console.log(response.data.items);
      this.listsrequest = response.data.items;
    });
  }
  createRequest() {
    // Lógica para crear la solicitud
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }
  viewRequest(){
    $('#modalDetail').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }
}
