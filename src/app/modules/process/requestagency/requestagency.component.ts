import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
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
    pickUpLocationId: '',
    collectionSiteId: '',
    transportadoraId: '',
    consultantId: '',
    name: '',
    description: '',
    requestDate: '',
    requestTime: '',
    estimatedQuantity: '',
    estimatedKG: '',
    isSpecial: false,
    requestStatusId: '',
    estimatedPickUpDate: '',
    estimatedPickUpTime: '',
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
        description: 'El volumen del pedido es mayor a 700 unidades.'
    },
    {
        name: 'Ruta No Definida',
        status: 'En Proceso',
        description: 'La ruta para la entrega aún no ha sido definida.'
    },
    {
        name: 'Cambio de Destino',
        status: 'Confirmado',
        description: 'El destino del pedido ha sido cambiado.'
    }
];

  constructor(
    private _Customers: CustomersService,
    private _Conveyor: ConvenyorService,
    private _Settings: SettingsService
  ) {}
  ngOnInit(): void {
    this.getRequest();
    this.getData();
  }

  getRequest(){
    
  }
  getData() {
    forkJoin({
      transportadores: this._Conveyor.getTransportadores(),
      listClientes: this._Customers.getClients(),
      listTipos: this._Settings.getCatalogChildrenByKey('TIPO_LUGAR_RECOGIDA'),
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
        this.listTipos = listTipos.data;
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
    // Lógica para crear la solicitud
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }

  updateRequest() {
    // Lógica para actualizar la solicitud
    console.log('Actualizando solicitud:', this.request);
  }


  selectItem(id: string, list: any[], target: 'selectedClient' | 'selectedTransportador' | 'selectedTipo') {
    this[target] = list.find((item: any) => item.id === id);
  }

  isSpecial(boolean: boolean){
    console.log(boolean);
  }
  
}
