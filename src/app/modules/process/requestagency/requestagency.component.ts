import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
declare var $: any;
@Component({
  selector: 'wlrd-requestagency',
  templateUrl: './requestagency.component.html',
  styleUrls: ['./requestagency.component.scss'],
})
export class RequestagencyComponent {
  // constructor(private) {}
  action = { name: 'Crear' }; // o 'Actualizar' según el caso
  viewoptions = true; // true para crear, false para actualizar

  request = {
    clientId: '',
    description: '',
    name: '',
    requestDate: '',
    requestTime: '',
    estimatedQuantity: '',
    estimatedKG: '',
    isSpecial: false,
    pickUpLocationId: '',
    observations: '',
    recommendations: '',
  };

  selectedClient: any = null;
  selectedTransportador: any = null;
  selectedTipo: any = null;
  listClient: any = [];
  listTransportador: any = [];
  listData: any = [];
  listTipos: any = [];
  listSedes: any = [];
  listCiudades: any = [];
  listZonas: any = [];
  requestStatuses: any[] = [
    {
      name: 'Volumen (>700)',
      status: 'Pendiente',
      description: 'El volumen del pedido es mayor a 700 unidades.',
    },
    {
      name: 'Ruta No Definida',
      status: 'En Proceso',
      description: 'La ruta para la entrega aún no ha sido definida.',
    },
    {
      name: 'Cambio de Destino',
      status: 'Confirmado',
      description: 'El destino del pedido ha sido cambiado.',
    },
  ];
  listsrequest: any[] = [];
  dataId: any;
  actionSave = false;
  constructor(
    private _Customers: CustomersService,
    private _Conveyor: ConvenyorService,
    private _Settings: SettingsService,
    private _requests: RequestsService,
    private _pickUp: PickuplocationService
  ) {}
  ngOnInit(): void {
    this.getRequest();
    this.getData();
  }

  getRequest() {
    this._requests.listSolicitudes('1').subscribe((response: any) => {
      console.log(response.data.items);
      this.listsrequest = response.data.items;
    });
  }
  getData() {
    forkJoin({
      transportadores: this._Conveyor.getTransportadores(),
      listClientes: this._Customers.getClients(),
      listTipos: this._pickUp.getPickUpLocations(),
      listSedes: this._Settings.getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO'),
      listCiudades: this._Settings.getCatalogChildrenByKey('CIUDAD'),
      listZonas: this._Settings.getCatalogChildrenByKey('ZONA'),
    }).subscribe({
      next: ({
        transportadores,
        listClientes,
        listTipos,
        listSedes,
        listCiudades,
        listZonas,
      }) => {
        // this.listData = list.data.items;
        this.listTransportador = transportadores.data.items;
        this.listClient = listClientes.data.items;
        this.listTipos = listTipos.data.items;
        this.listSedes = listSedes.data;
        this.listCiudades = listCiudades.data;
        this.listZonas = listZonas.data;
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }
  createRequest() {
    this.actionSave = false;
    // Lógica para crear la solicitud
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }

  updateRequest(item: any) {
    console.log(item);
    this.actionSave = true;
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    // Lógica para actualizar la solicitud
    this.dataId = item;
    this.request = {
      clientId: item.client,
      description: item.description,
      name: item.name,
      requestDate: item.requestDate,
      requestTime: item.requestTime,
      estimatedQuantity: item.estimatedQuantity,
      estimatedKG: item.estimatedKG,
      isSpecial: item.isSpecial,
      pickUpLocationId: item.pickUpLocation,
      observations: item.observations,
      recommendations: item.recommendations,
    };
    console.log('Actualizando solicitud:', this.request);
  }

  selectItem(
    id: string,
    list: any[],
    target: 'selectedClient' | 'selectedTransportador' | 'selectedTipo'
  ) {
    this[target] = list.find((item: any) => item.id === id);
  }

  isSpecial(boolean: boolean) {
    console.log(boolean);
  }

  saveRequest() {
    const action = this.actionSave
      ? this._requests.updateSolicitud(this.dataId.id, {
          collectionSiteId: this.dataId.collectionSite,
          consultantId: this.dataId.consultant,
          transporterId: this.dataId.transporter,
        })
      : this._requests.createSolicitud(this.request);

    action.subscribe((response: any) => {
      if (response.success) {
        // Si la respuesta es positiva
        $('#modalRequest').modal('hide'); // Cerrar el modal
        this.dataId =  []; // Limpiar los objetos
        this.clearData();
      }
      console.log(response, this.request);
    });
  }

  clearData(){
    this.request = {
      clientId: '',
      description: '',
      name: '',
      requestDate: '',
      requestTime: '',
      estimatedQuantity: '',
      estimatedKG: '',
      isSpecial: false,
      pickUpLocationId: '',
      observations: '',
      recommendations: '',
    };
  }
}
