import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
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
    taxId: '',
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
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  itemId: string = '';
  countries: any = [];
  cities: any = [];

  constructor(
    private _Service: CentersService,
    private _settings: SettingsService
  ) {}
  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    forkJoin({
      centers: this._Service.getCollectionSites(),
      countries: this._settings.getCatalogChildrenByKey('PAIS'),
      cities: this._settings.getCatalogChildrenByKey('CIUDAD'),

    }).subscribe({
      next: (data: any) => {
        this.listData = data.centers.data.items;
        this.countries = data.countries.data;
        this.cities = data.cities.data;
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  createOrUpdateCenter(item: any | null): void {
    this.resetCenter();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalCenter').modal({ backdrop: 'static', keyboard: false });
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.centers = {
        siteTypeId: item.siteTypeId || '',
        countryId: item.countryId || '',
        cityId: item.cityId || '',
        name: item.name || '',
        description: item.description || '',
        taxId: item.taxId || '',
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
      taxId: '',
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

  saveRecord(): void {
    console.log(this.centers);

    // Verifica que los campos no estén vacíos
    if (!this.centers.siteTypeId) {
      // Llamada al servicio para crear un nuevo registro
      this._Service.createCollectionSite(this.centers)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.selectData();
            this.close();
          },
          error: (error: any) => {
            console.error('Error al crear el registro:', error);
          },
        });
    } else if (this.centers.siteTypeId) {
      // Llamada al servicio para actualizar un registro existente
      this._Service.updateCollectionSite(this.centers.siteTypeId, this.centers)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.selectData();
            this.close();
          },
          error: (error: any) => {
            console.error('Error al actualizar el registro:', error);
          },
        });
    }
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
    this._Service.createCollectionSite(this.itemId).subscribe({
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
