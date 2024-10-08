import { Component } from '@angular/core';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
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
    estimatedPickUpDate: '',
    estimatedPickUpTime: '',
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
    private _pickUp: PickuplocationService,
    private _toast: ToastService
  ) {}
  ngOnInit(): void {
    this.getRequest();
    this.getData();
  }

  getRequest() {
    this._requests.listSolicitudes().subscribe((response: any) => {
      console.log(response.data.items);
      this.listsrequest = response.data.items;
    });
  }
  getData() {
      this._Conveyor.getTransportadores().subscribe({
        next: (response: any) => {
          this.listTransportador = response.data.items;
        },
        error: (error: any) => {
          console.error('Error al obtener transportadores:', error);
        },
      });
    
      this._Customers.getClients().subscribe({
        next: (response: any) => {
          this.listClient = response.data.items;
        },
        error: (error: any) => {
          console.error('Error al obtener clientes:', error);
        },
      });
    
      this._pickUp.getPickUpLocations().subscribe({
        next: (response: any) => {
          this.listTipos = response.data.items;
        },
        error: (error: any) => {
          console.error('Error al obtener tipos de recogida:', error);
        },
      });
    
      this._Settings.getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO').subscribe({
        next: (response: any) => {
          this.listSedes = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener tipos de sedes:', error);
        },
      });
    
      this._Settings.getCatalogChildrenByKey('CIUDAD').subscribe({
        next: (response: any) => {
          this.listCiudades = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener ciudades:', error);
        },
      });
    
      this._Settings.getCatalogChildrenByKey('ZONA').subscribe({
        next: (response: any) => {
          this.listZonas = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener zonas:', error);
        },
      });
    
  }
  createRequest() {
    this.actionSave = false;
    // Lógica para crear la solicitud
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }

  // updateRequest(item: any) {
  //   console.log(item);
  //   this.actionSave = true;
  //   $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
  //   // Lógica para actualizar la solicitud
  //   this.dataId = item;
  //   this.request = {
  //     clientId: item.client,
  //     description: item.description,
  //     name: item.name,
  //     requestDate: item.requestDate,
  //     requestTime: item.requestTime,
  //     estimatedPickUpDate: '',
  //     estimatedPickUpTime: '',
  //     estimatedQuantity: item.estimatedQuantity,
  //     estimatedKG: item.estimatedKG,
  //     isSpecial: item.isSpecial,
  //     pickUpLocationId: item.pickUpLocation,
  //     observations: item.observations,
  //     recommendations: item.recommendations,
  //   };
  //   console.log('Actualizando solicitud:', this.request);
  // }

  selectItem(
    id: string,
    list: any[],
    target: 'selectedClient' | 'selectedTransportador' | 'selectedTipo'
  ) {
    this[target] = list.find((item: any) => item.id === id);
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
      this._toast.success('Completado','Ruta registrada exitosamente')
        // Si la respuesta es positiva
        $('#modalRequest').modal('hide');

        this.dataId = []; // Limpiar los objetos
        this.clearData();
        this.getRequest();
    });
  }

  clearData() {
    this.request = {
      clientId: '',
      description: '',
      name: '',
      requestDate: '',
      requestTime: '',
      estimatedPickUpDate: '',
      estimatedPickUpTime: '',
      estimatedQuantity: '',
      estimatedKG: '',
      isSpecial: false,
      pickUpLocationId: '',
      observations: '',
      recommendations: '',
    };
  }
}
