import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
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
    id: '',
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
  listData: any[] = [];
  listBase: any[] = [];

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
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  paginatedList: any = [];
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  constructor(
    private _Service: CentersService,
    private _settings: SettingsService,
    private _toast: ToastService
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

    this.lisKey();
  }

  lisKey(){
    this._Service.getCollectionSites().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
        this.listBase = this.listData; // Guardamos la lista original para filtrar
        this.totalPages = Math.ceil(this.listData.length / this.itemsPerPage); // Total de páginas
        this.pagination.totalItems = response.data.length;
        this.updatePaginatedList(); // Actualiza la lista paginada
        this.search();
        this.selectData();
      },
      error: (error: any) => {
        console.error('Error al obtener centros de recolección:', error);
      },
    });
  }

  getNameSiteType(type: string) {
    return this.typeCenters.find((x: any) => x.id === type)?.name
  }

  selectData(): void {


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
        id: item.id,
        siteTypeId: item.siteTypeId || '',
        countryId: item.countryId || '',
        cityId: item.cityId || '',
        name: item.name || '',
        description: item.description || '',
        nit: item.nit || '',
        businessName: item.name || '',
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
      id: '',
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
    if (this.centers.id) {
      this._Service
        .updateCollectionSite(this.centers.id, this.getCenterPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }
  createCollection(): void {
    if (this.areFieldsValid()) {
      this._Service.createCollectionSite(this.getCenterPayload()).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) =>
          this._toast.error('Importante','Error al crear el registro')
        });
    } else {
      this._toast.warning('Importante','Por favor, completa todos los campos obligatorios.');
    }
  }

  private areFieldsValid(): boolean {
    const fields = [
      { value: this.centers.siteTypeId, message: 'El campo Tipo de Sitio es obligatorio.' },
      { value: this.centers.countryId, message: 'El campo País es obligatorio.' },
      { value: this.centers.cityId, message: 'El campo Ciudad es obligatorio.' },
      { value: this.centers.name, message: 'El campo Nombre es obligatorio.' },
      { value: this.centers.description, message: 'El campo Descripción es obligatorio.' },
      { value: this.centers.nit, message: 'El campo NIT es obligatorio.' },
      { value: this.centers.neighborhood, message: 'El campo Barrio es obligatorio.' },
      { value: this.centers.address, message: 'El campo Dirección es obligatorio.' },
      { value: this.centers.latitude, message: 'El campo Latitud es obligatorio.' },
      { value: this.centers.longitude, message: 'El campo Longitud es obligatorio.' },
      { value: this.centers.contactName, message: 'El campo Nombre de Contacto es obligatorio.' },
      { value: this.centers.contactEmail, message: 'El campo Email de Contacto es obligatorio.' },
      { value: this.centers.contactPhone, message: 'El campo Teléfono de Contacto es obligatorio.' },
      { value: this.centers.referenceWLL, message: 'El campo Referencia WLL es obligatorio.' },
      { value: this.centers.referencePH, message: 'El campo Referencia PH es obligatorio.' },
    ];

    for (const field of fields) {
      if (!field.value) {
        this._toast.info('Importante',field.message);
        return false;
      }
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.centers.contactEmail)) {
      this._toast.info('Importante', 'El campo Email de Contacto no tiene un formato válido.');
      return false;
    }

    return true;
  }


  private getCenterPayload() {
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
      businessName: name,
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
    this.lisKey();
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
        this.lisKey();
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }

  delete() {
    this._Service.deleteCollectionSite(this.itemId).subscribe({
      next: () => {
        this.lisKey();
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }



   // paginación
   updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listData.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.listData.length / this.itemsPerPage); // Calcula el total de páginas
  }

  onPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPage = Number(selectElement.value);
    this.goToPage(selectedPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList(); // Actualiza la lista para la nueva página
    }
  }
  get pagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      this.listData = this.listBase.filter(item => {
        const itemValues = Object.values(item);
        return itemValues.some(item =>
          String(item).toLowerCase().includes(value.toLowerCase()),
        );
      });
    });
  }
}
