import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { ToastService } from 'src/app/core/services/toast.service';
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
  listData: any = [];
  listBase: any = [];
  pagination: any = {};
  searchTerm$ = new Subject<any>();
  paginatedList: any = [];
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  constructor(private _Service: ConvenyorService, private _toast: ToastService) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalconveyor'), {
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
    this._Service.getTransportadores().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
        this.listBase = this.listData; // Guardamos la lista original para filtrar
        this.pagination.totalItems = response.data.length;
        this.updatePaginatedList(); // Actualiza la lista paginada
        this.search();
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
        businessName: item.name || '',
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
    if (this.areFieldsValid()) {
      this._Service.createTransportador(this.getConveyorPayload()).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) =>
          console.error('Error al crear el registro:', error),
      });
    }
  }
  
  private areFieldsValid(): boolean {
    const fields = [
      { value: this.conveyor.name, message: 'El campo Nombre es obligatorio.' },
      { value: this.conveyor.taxId, message: 'El campo Tax ID es obligatorio.' },
      { value: this.conveyor.description, message: 'El campo Descripción es obligatorio.' },
      { value: this.conveyor.contactName, message: 'El campo Nombre de Contacto es obligatorio.' },
      { value: this.conveyor.contactEmail, message: 'El campo Email de Contacto es obligatorio.' },
      { value: this.conveyor.referenceWLL, message: 'El campo Referencia WLL es obligatorio.' },
      { value: this.conveyor.referencePH, message: 'El campo Referencia PH es obligatorio.' },
    ];
  
    for (const field of fields) {
      if (!field.value) {
        this._toast.info('Importante',field.message);
        return false;
      }
    }
  
    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.conveyor.contactEmail)) {
      this._toast.info('Importante', 'El campo Email de Contacto no tiene un formato válido.');
      return false;
    }
  
    return true;
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
      businessName: name,
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

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      this.listData = this.listBase.filter((item: any) => {
        const itemValues = Object.values(item);
        return itemValues.some((item) =>
          String(item).toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }
}
