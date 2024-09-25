import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdviserService } from 'src/app/core/services/process/adviser.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
declare var $: any;

@Component({
  selector: 'wlrd-pickuplocation',
  templateUrl: './pickuplocation.component.html',
  styleUrls: ['./pickuplocation.component.scss'],
})
export class PickuplocationComponent {
  switchSection: string = 'List';
  actionModal: string = '';
  viewoptions = true;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  itemId: string = '';
  lugar = {
    id: '', // Cambiar todos los números a cadenas
    placeTypeId: '',
    clientId: '',
    collectionSiteId: '',
    consultantId: '',
    cityId: '',
    zoneId: '',
    name: '',
    description: '',
    neighborhood: '',
    address: '',
    latitude: '',
    longitude: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    referenceWLL: '',
    referencePH: '',
  };
  
  listClientes: any = [];
  listAsesores: any = [];
  listTipos: any = [];
  listSedes: any = [];
  listCiudades: any = [];
  listZonas: any = [];
  listData: any = [];
  listProduct: any = [];
  Measure: any = [];
  constructor(
    private _Service: PickuplocationService,
    private _Customers: CustomersService,
    private _Adviser: AdviserService,
    private _Settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    forkJoin({
      list: this._Service.getPickUpLocations(),
      listClientes: this._Customers.getClients(),
      listAsesores: this._Adviser.getConsultants(),
      listTipos: this._Settings.getCatalogChildrenByKey('TIPO_LUGAR_RECOGIDA'),
      listSedes: this._Settings.getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO'),
      listCiudades: this._Settings.getCatalogChildrenByKey('CIUDAD'),
      listZonas: this._Settings.getCatalogChildrenByKey('ZONA'),
    }).subscribe({
      next: ({
        list,
        listClientes,
        listAsesores,
        listTipos,
        listSedes,
        listCiudades,
        listZonas,
      }) => {
        this.listData = list.data.items;
        this.listClientes = listClientes.data.items;
        this.listAsesores = listAsesores.data.items;
        this.listTipos = listTipos.data;
        this.listSedes = listSedes.data;
        this.listCiudades = listCiudades.data;
        this.listZonas = listZonas.data;
      },
      error: (error) => console.error('Error al obtener datos:', error),
    });
  }

  createOrUpdatepickup(item: any | null): void {
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalPickup').modal({ backdrop: 'static', keyboard: false });
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.lugar = {
        id: '', // Cambiar todos los números a cadenas
        placeTypeId: '',
        clientId: '',
        collectionSiteId: '',
        consultantId: '',
        cityId: '',
        zoneId: '',
        name: '',
        description: '',
        neighborhood: '',
        address: '',
        latitude: '',
        longitude: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        referenceWLL: '',
        referencePH: '',
      };
    }
  }

  resetUser(): void {
    this.lugar = {
      id: '', // Cambiar todos los números a cadenas
      placeTypeId: '',
      clientId: '',
      collectionSiteId: '',
      consultantId: '',
      cityId: '',
      zoneId: '',
      name: '',
      description: '',
      neighborhood: '',
      address: '',
      latitude: '',
      longitude: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      referenceWLL: '',
      referencePH: '',
    };
  }

  close() {
    $('#modalPickup').modal('hide');
  }

  updateLugar(): void {
    if (this.lugar.id) {
      this._Service
        .updatePickUpLocation(this.lugar.id, this.getLugarPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createLugar(): void {
    this._Service.createPickUpLocation(this.getLugarPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  getLugarPayload() {
    const {
      placeTypeId,
      clientId,
      collectionSiteId,
      consultantId,
      cityId,
      zoneId,
      name,
      description,
      neighborhood,
      address,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactPhone,
      referenceWLL,
      referencePH,
    } = this.lugar;

    return {
      placeTypeId: parseInt(placeTypeId, 10),
      clientId: parseInt(clientId, 10),
      collectionSiteId: parseInt(collectionSiteId, 10),
      consultantId: parseInt(consultantId, 10),
      cityId: parseInt(cityId, 10),
      zoneId: parseInt(zoneId, 10),
      name,
      description,
      neighborhood,
      address,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactPhone,
      referenceWLL,
      referencePH,
    };
  }
  handleSuccess(response: any): void {
    console.log(response);
    this.selectData();
    this.close();
  }

  removeItem(id: string) {
    this.itemId = id;
    this.action.name = 'Eliminar';
    this.action.value = 'delete';
    this.action.color = '#dc3545';
    this.action.icon = 'fa-solid fa-trash';
    $('#modalconfirm').modal({ backdrop: 'static', keyboard: false });
  }

  editState(id: string) {
    this.itemId = id;
    this.action.name = 'Modificar Estado';
    this.action.value = 'changestatus';
    this.action.color = '#ffc107';
    this.action.icon = 'fa-solid fa-sync';
    $('#modalconfirm').modal({ backdrop: 'static', keyboard: false });
  }

  actionConfirm() {
    switch (this.action.value) {
      case 'delete':
        this.delete();
        break;
      case 'changestatus':
        this.changeStatus();
        break;
      default:
        break;
    }
  }

  changeStatus() {
    this._Service.changeConsultantStatus(this.itemId).subscribe({
      next: () => {
        this.selectData();
        $('#modalconfirm').modal('hide');
      },
      error: () => {},
    });
  }

  delete() {
    this._Service.deletePickUpLocation(this.itemId).subscribe({
      next: () => {
        this.selectData();
        $('#modalconfirm').modal('hide');
      },
      error: () => {},
    });
  }
}
