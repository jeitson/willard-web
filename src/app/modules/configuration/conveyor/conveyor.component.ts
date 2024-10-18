import { Component } from '@angular/core';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
// declare var $: any;
declare var bootstrap: any;
@Component({
  selector: 'wlrd-conveyor',
  templateUrl: './conveyor.component.html',
  styleUrls: ['./conveyor.component.scss'],
})
export class ConveyorComponent {
  viewoptions = true;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  modal: any;
  modalConfirm: any;
  itemId: string = '';
  conveyor = {
    id: null,
    name: '',
    taxId: '',
    businessName: '',
    description: '',
    contactName: '',
    contactEmail: '',
    referenceWLL: '',
    referencePH: '',
  };
  currentPage = 1;
  listData: any = [];

  constructor(private _Service: ConvenyorService) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalconveyor'), {backdrop: 'static', keyboard: false})
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalconfirm'), {backdrop: 'static', keyboard: false})
    this.selectData();
  }

  selectData(): void {
    this._Service.getTransportadores().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener transportadores:', error);
      },
    });
  }
  

  createOrUpdateconveyor(item: any | null): void {
    this.resetconveyor();
    this.action.name = 'Crear';
    this.viewoptions = true;
    // $('#modalconveyor').modal('show');
    this.modal.show();
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.conveyor = {
        id: item.id,
        name: item.name || '',
        taxId: item.taxId || '',
        businessName: item.businessName || '',
        description: item.description || '',
        contactName: item.contactName || '',
        contactEmail: item.contactEmail || '',
        referenceWLL: item.referenceWLL || '',
        referencePH: item.referencePH || '',
      };
    }
  }

  resetconveyor(): void {
    this.conveyor = {
      id: null,
      name: '',
      taxId: '',
      businessName: '',
      description: '',
      contactName: '',
      contactEmail: '',
      referenceWLL: '',
      referencePH: '',
    };
  }

  close(): void {
    this.modal.hide();
  }

 

  updateConveyor(): void {
    if (this.conveyor.id) {
      this._Service
        .updateTransportador(this.conveyor.id, this.getConveyorPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createConveyor(): void {
    this._Service.createTransportador(this.getConveyorPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  getConveyorPayload() {
    const {
      id,
      name,
      taxId,
      businessName,
      description,
      contactName,
      contactEmail,
      referenceWLL,
      referencePH,
    } = this.conveyor;
  
    return {
      id,
      name,
      taxId,
      businessName,
      description,
      contactName,
      contactEmail,
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
    this._Service.changeTransportadorStatus(this.itemId).subscribe({
      next: () => {
        this.selectData();
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }

  delete() {
    this._Service.deleteTransportador(this.itemId).subscribe({
      next: () => {
        this.selectData();
        this.modalConfirm.hide();
      },
      error: () => {},
    });
  }
}
