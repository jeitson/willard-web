import { Component } from '@angular/core';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
declare var bootstrap: any;
@Component({
  selector: 'wlrd-requestagency',
  templateUrl: './requestagency.component.html',
  styleUrls: ['./requestagency.component.scss'],
})
export class RequestagencyComponent {
  // constructor(private) {}
  action = { name: 'Crear' }; // o 'Actualizar' según el caso
  viewoptions = true; // true para crear, false para actualizar
  modal: any;

  request = {
    clientId: '',
    description: '',
    name: '',
    productTypeId: '',
    requestDate: '',
    requestTime: '',
    estimatedPickUpDate: '',
    estimatedPickUpTime: '',
    estimatedQuantity: '',
    estimatedKG: '',
    isSpecial: false,
    motiveSpecialId: '',
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
  listsrequest: any[] = [];
  listmotive: any[] = [];

  dataId: any;
  actionSave = false;
  roleId: any;
  isSpecialDisabled: boolean = false;
  typeProduct: any = [];
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
    this.modal = new bootstrap.Modal(document.getElementById('modalRequestAgency'), {backdrop: 'static', keyboard: false})
    this.roleId = sessionStorage.getItem('RoleId');
    // Obtener el objeto guardado en sessionStorage
      // Si el roleId es 16, deshabilita el checkbox
      if (this.roleId === '16') {
        this.isSpecialDisabled = true;
        this.request.isSpecial = true;
      }
  }


  getRequest() {
    this._requests.listSolicitudes().subscribe((response: any) => {
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
      this._Settings.getCatalogChildrenByKey('TIPO_PRODUCTO').subscribe({
        next: (response: any) => {
          this.typeProduct = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener ciudades:', error);
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

      this._Settings.getCatalogChildrenByKey('ZONA').subscribe({
        next: (response: any) => {
          this.listZonas = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener zonas:', error);
        },
      });
      this._Settings.getCatalogChildrenByKey('MOTIVO_ESPECIAL').subscribe({
        next: (response: any) => {
          this.listmotive = response.data;
        },
        error: (error: any) => {
          console.error('Error al obtener tipos de sedes:', error);
        },
      });

  }
  createRequest() {
    this.clearData();
    this.actionSave = false;
    // Lógica para crear la solicitud
    this.modal.show();
  }

  updateRequest(item: any) {
    console.log(item);
    this.actionSave = true;
    this.modal.show();
    // Lógica para actualizar la solicitud
    this.dataId = item;
    this.request = {
      clientId: item.client.id, // Cambiado de item.clientId a item.client.businessName
      description: item.description,
      name: item.name,
      productTypeId: item.productTypeId,
      requestDate: item.requestDate,
      requestTime: item.requestTime,
      estimatedPickUpDate: item.estimatedPickUpDate,
      estimatedPickUpTime: item.estimatedPickUpTime,
      estimatedQuantity: item.estimatedQuantity,
      estimatedKG: item.estimatedKG,
      isSpecial: item.isSpecial,
      motiveSpecialId: item.motiveSpecial?.id,
      pickUpLocationId: item.pickUpLocation.id, // Aquí se obtiene el ID de la ubicación de recogida
      observations: item.observations,
      recommendations: item.recommendations,
  };

  }

  selectItem(
    id: string,
    list: any[],
    target: 'selectedClient' | 'selectedTransportador' | 'selectedTipo'
  ) {
    this[target] = list.find((item: any) => item.id === id);
  }

  saveRequest() {
    const action = this.actionSave
      ? this._requests.updateSolicitud(this.dataId.id, this.request)
      : this._requests.createSolicitud(this.request);

    action.subscribe((response: any) => {
      this._toast.success('Completado','Ruta registrada exitosamente')
        // Si la respuesta es positiva
        this.modal.hide();

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
      productTypeId: '',
      requestDate: '',
      requestTime: '',
      estimatedPickUpDate: '',
      estimatedPickUpTime: '',
      estimatedQuantity: '',
      estimatedKG: '',
      isSpecial: this.isSpecialDisabled ? true : false,
      motiveSpecialId: '',
      pickUpLocationId: '',
      observations: '',
      recommendations: '',
    };
    this.selectedClient = null;
  }
}
