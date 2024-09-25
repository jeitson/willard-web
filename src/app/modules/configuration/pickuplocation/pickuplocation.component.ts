import { Component } from '@angular/core';
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
    this._Service.getPickUpLocations().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;

        // Llamadas individuales a los otros servicios
        this._Customers.getClients().subscribe({
          next: (clientesResponse: any) => {
            this.listClientes = clientesResponse.data.items;

            this._Adviser.getConsultants().subscribe({
              next: (asesoresResponse: any) => {
                this.listAsesores = asesoresResponse.data.items;

                this._Settings
                  .getCatalogChildrenByKey('TIPO_LUGAR_RECOGIDA')
                  .subscribe({
                    next: (tiposResponse: any) => {
                      this.listTipos = tiposResponse.data;

                      this._Settings
                        .getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO')
                        .subscribe({
                          next: (sedesResponse: any) => {
                            this.listSedes = sedesResponse.data;

                            this._Settings
                              .getCatalogChildrenByKey('CIUDAD')
                              .subscribe({
                                next: (ciudadesResponse: any) => {
                                  this.listCiudades = ciudadesResponse.data;

                                  this._Settings
                                    .getCatalogChildrenByKey('ZONA')
                                    .subscribe({
                                      next: (zonasResponse: any) => {
                                        this.listZonas = zonasResponse.data;
                                      },
                                      error: (error: any) => {
                                        console.error(
                                          'Error al obtener zonas:',
                                          error
                                        );
                                      },
                                    });
                                },
                                error: (error: any) => {
                                  console.error(
                                    'Error al obtener ciudades:',
                                    error
                                  );
                                },
                              });
                          },
                          error: (error: any) => {
                            console.error('Error al obtener sedes:', error);
                          },
                        });
                    },
                    error: (error: any) => {
                      console.error(
                        'Error al obtener tipos de lugar de recogida:',
                        error
                      );
                    },
                  });
              },
              error: (error: any) => {
                console.error('Error al obtener asesores:', error);
              },
            });
          },
          error: (error: any) => {
            console.error('Error al obtener clientes:', error);
          },
        });
      },
      error: (error: any) => {
        console.error('Error al obtener lugares de recogida:', error);
      },
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
