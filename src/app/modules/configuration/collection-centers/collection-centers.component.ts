import { Component } from '@angular/core';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
declare var $: any;
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
  viewoptions = true;
  currentPage = 1;
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
  constructor(
    private _Service: CentersService,
    private _settings: SettingsService
  ) {}
  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    this._Service.getCollectionSites().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
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
    $('#modalCenter').modal('show');
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

  close(): void {
    $('#modalCenter').modal('hide');
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
    this.close();
  }

  removeItem(id: string) {
    this.itemId = id;
    this.action.name = 'Eliminar';
    this.action.value = 'delete';
    this.action.color = '#dc3545';
    this.action.icon = 'fa-solid fa-trash';
    $('#modalconfirm').modal('show');
  }

  editState(id: string) {
    this.itemId = id;
    this.action.name = 'Modificar Estado';
    this.action.value = 'changestatus';
    this.action.color = '#ffc107';
    this.action.icon = 'fa-solid fa-sync';
    $('#modalconfirm').modal('show');
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
        $('#modalconfirm').modal('hide');
      },
      error: () => {},
    });
  }

  delete() {
    this._Service.deleteCollectionSite(this.itemId).subscribe({
      next: () => {
        this.selectData();
        $('#modalconfirm').modal('hide');
      },
      error: () => {},
    });
  }
}
