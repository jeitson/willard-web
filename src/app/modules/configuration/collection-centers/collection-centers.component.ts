import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
// declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'wlrd-collection-centers',
  templateUrl: './collection-centers.component.html',
  styleUrls: ['./collection-centers.component.scss'],
})
export class CollectionCentersComponent {
  // Actualiza el objeto record con la nueva estructura
  centers = {
    siteTypeId: '',
    countryId: '',
    cityId: '',
    name: '',
    description: '',
    nit: '',
    businessName: '',
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
  listData: any = [];
  listBase: any = [];

  viewoptions = true;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  itemId: string = '';
  countries: any = [];
  cities: any = [];
  typeCenters: any = [];
  modal: any;
  modalConfirm: any;
  pagination: any = {};
  searchTerm$ = new Subject<any>();
  paginatedList: any = [];
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  constructor(
    private _Service: CentersService,
    private _settings: SettingsService
  ) {}
  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalCenter'), {
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
    this._Service.getCollectionSites().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
        this.listBase = this.listData; // Guardamos la lista original para filtrar
        this.pagination.totalItems = response.data.length;
        this.updatePaginatedList(); // Actualiza la lista paginada
      },
      error: (error: any) => {
        console.error('Error al obtener centros de recolección:', error);
      },
    });
  
    this._settings.getCatalogChildrenByKey('PAIS').subscribe({
      next: (response: any) => {
        this.countries = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener países:', error);
      },
    });
  
    this._settings.getCatalogChildrenByKey('CIUDAD').subscribe({
      next: (response: any) => {
        this.cities = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener ciudades:', error);
      },
    });
  
    this._settings.getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO').subscribe({
      next: (response: any) => {
        this.typeCenters = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener tipos de sedes:', error);
      },
    });
  }
  

  createOrUpdateCenter(item: any | null): void {
    this.resetCenter();
    this.action.name = 'Crear';
    this.viewoptions = true;
    this.modal.show();
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.centers = {
        siteTypeId: item.siteTypeId || '',
        countryId: item.countryId || '',
        cityId: item.cityId || '',
        name: item.name || '',
        description: item.description || '',
        nit: item.nit || '',
        businessName: item.businessName || '',
        neighborhood: item.neighborhood || '',
        address: item.address || '',
        latitude: item.latitude || '',
        longitude: item.longitude || '',
        contactName: item.contactName || '',
        contactEmail: item.contactEmail || '',
        contactPhone: item.contactPhone || '',
        referenceWLL: item.referenceWLL || '',
        referencePH: item.referencePH || '',
      };
    }
  }

  resetCenter(): void {
    this.centers = {
      siteTypeId: '',
      countryId: '',
      cityId: '',
      name: '',
      description: '',
      nit: '',
      businessName: '',
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

 

  updateCollection(): void {
    if (this.centers.siteTypeId) {
      this._Service
        .updateCollectionSite(this.centers.siteTypeId, this.getCenterPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createCollection(): void {
    this._Service.createCollectionSite(this.getCenterPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  getCenterPayload() {
    const {
      siteTypeId,
      countryId,
      cityId,
      name,
      description,
      nit,
      businessName,
      neighborhood,
      address,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactPhone,
      referenceWLL,
      referencePH,
    } = this.centers;

    return {
      siteTypeId,
      countryId,
      cityId,
      name,
      description,
      nit,
      businessName,
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
    this.modal.hide();
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
    this._Service.changeCollectionSiteStatus(this.itemId).subscribe({
      next: () => {
        this.selectData();
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }

  delete() {
    this._Service.deleteCollectionSite(this.itemId).subscribe({
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
