import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdviserService } from 'src/app/core/services/process/adviser.service';
declare var $: any;
@Component({
  selector: 'wlrd-adviser',
  templateUrl: './adviser.component.html',
  styleUrls: ['./adviser.component.scss'],
})
export class AdviserComponent {
  // Actualiza el objeto adviser con la nueva estructura
  adviser = {
    id: null,
    name: '',
    email: '',
    phone: '',
    description: '',
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
  constructor(private _Service: AdviserService) {}

  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    forkJoin({
      transportadores: this._Service.getConsultants(),
    }).subscribe({
      next: (data: any) => {
        this.listData = data.transportadores.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  createOrUpdateadviser(item: any | null): void {
    this.resetadviser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalconveyor').modal({ backdrop: 'static', keyboard: false });
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.adviser = {
        id: item.id,
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        description: item.description || '',
        referencePH: item.referencePH || '',
      };
    }
  }

  resetadviser(): void {
    this.adviser = {
      id: null,
      name: '',
      email: '',
      phone: '',
      description: '',
      referencePH: '',
    };
  }

  close(): void {
    $('#modalconveyor').modal('hide');
  }

 

  updateAdviser(): void {
    if (this.adviser.id) {
      this._Service.updateConsultant(this.adviser.id, this.getadviserPayload()).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) => console.error('Error al actualizar el registro:', error),
      });
    }
  }
  
  createAdviser(): void {
    if (!this.adviser.id) {
      this._Service.createConsultant(this.getadviserPayload()).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) => console.error('Error al crear el registro:', error),
      });
    }
  }
  private getadviserPayload() {
    const { name, email, phone, description, referencePH } = this.adviser;
    return { name, email, phone, description, referencePH };
  }
  private handleSuccess(response: any): void {
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
    this._Service.deleteConsultant(this.itemId).subscribe({
      next: () => {
        this.selectData();
        $('#modalconfirm').modal('hide');
      },
      error: () => {},
    });
  }
}
