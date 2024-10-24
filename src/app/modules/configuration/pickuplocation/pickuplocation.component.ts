import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { AdviserService } from 'src/app/core/services/process/adviser.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { UsersService } from 'src/app/core/services/security/users.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
// declare var $: any;
declare var bootstrap: any;

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
  modal: any;
  modalConfirm: any;
  pagination: any = {};
  searchTerm$ = new Subject<any>();
  paginatedList: any = [];
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  listBase: any = [];
  constructor(
    private _Service: PickuplocationService,
    private _Customers: CustomersService,
    private _Adviser: AdviserService,
    private _Settings: SettingsService,
    private userService: UsersService,
  ) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalPickup'), {
      backdrop: 'static',
      keyboard: false,
    });
    this.modalConfirm = new bootstrap.Modal(
      document.getElementById('modalconfirm'),
      { backdrop: 'static', keyboard: false }
    );
    this.selectData();
  }

  selectData(): void {
    this.getPickUpLocations();
    this.getClients();
    this.getConsultants();
    this.getCatalogChildren('TIPO_LUGAR_RECOGIDA');
    this.getCatalogChildren('TIPOS_SEDES_ACOPIO');
    this.getCatalogChildren('CIUDAD');
    this.getCatalogChildren('ZONA');
  }

  getPickUpLocations(): void {
    this._Service.getPickUpLocations().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
        this.listBase = this.listData; // Guardamos la lista original para filtrar
        this.pagination.totalItems = response.data.length;
        this.updatePaginatedList(); // Actualiza la lista paginada
      },
      error: (error: any) => {
        console.error('Error al obtener lugares de recogida:', error);
      },
    });
  }

  getClients(): void {
    this._Customers.getClients().subscribe({
      next: (clientesResponse: any) => {
        this.listClientes = clientesResponse.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener clientes:', error);
      },
    });
  }

  getConsultants(): void {
    // this._Adviser.getConsultants().subscribe({
    //   next: (asesoresResponse: any) => {
    //     this.listAsesores = asesoresResponse.data.items;
    //   },
    //   error: (error: any) => {
    //     console.error('Error al obtener asesores:', error);
    //   },
    // });

    this.userService.allUsers().subscribe({
      next: (asesoresResponse: any) => {
        this.listAsesores = asesoresResponse.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener asesores:', error);
      },
    });
  }

  getCatalogChildren(key: string): void {
    this._Settings.getCatalogChildrenByKey(key).subscribe({
      next: (response: any) => {
        switch (key) {
          case 'TIPO_LUGAR_RECOGIDA':
            this.listTipos = response.data;
            break;
          case 'TIPOS_SEDES_ACOPIO':
            this.listSedes = response.data;
            break;
          case 'CIUDAD':
            this.listCiudades = response.data;
            break;
          case 'ZONA':
            this.listZonas = response.data;
            break;
          default:
            console.error('Clave no reconocida:', key);
            break;
        }
      },
      error: (error: any) => {
        console.error(`Error al obtener ${key}:`, error);
      },
    });
  }

  createOrUpdatepickup(item: any | null): void {
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    this.modal.show();
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
    this.modal.hide();
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
    this.modalConfirm.show();
  }

  editState(id: string) {
    this.itemId = id;
    this.action.name = 'Modificar Estado';
    this.action.value = 'changestatus';
    this.action.color = '#ffc107';
    this.action.icon = 'fa-solid fa-sync';
    this.modalConfirm.show();
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
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }

  delete() {
    this._Service.deletePickUpLocation(this.itemId).subscribe({
      next: () => {
        this.selectData();
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }

  
    // paginación
    onPageChange(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedPage = Number(selectElement.value);
      this.goToPage(selectedPage);
    }
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedList();
      }
    }
    get pagesArray() {
      return Array(this.totalPages)
        .fill(0)
        .map((x, i) => i + 1);
    }

    updatePaginatedList() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedList = this.listData.slice(startIndex, endIndex);
      this.totalPages = Math.ceil(this.listData.length / this.itemsPerPage); // Calcula el total de páginas
    }


    onSearchChange(value: string): void {
      if (!value) {
        this.listData = [...this.listBase]; // Restablecer la lista original si no hay búsqueda
      } else {
        this.listData = this.listBase.filter((item: any) => {
          const itemValues: any = Object.values(item);
          return itemValues.some((val: string) =>
            String(val).toLowerCase().includes(value.toLowerCase())
          );
        });
      }
      this.currentPage = 1; // Reinicia a la primera página
      this.updatePaginatedList(); // Actualiza la lista paginada después del filtrado
    }
}
