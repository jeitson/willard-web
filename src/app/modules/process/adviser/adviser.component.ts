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
  // Actualiza el objeto record con la nueva estructura
  record = {
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

  createOrUpdateRecord(item: any | null): void {
    this.resetRecord();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalconveyor').modal({ backdrop: 'static', keyboard: false });
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.record = {
        id: item.id,
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        description: item.description || '',
        referencePH: item.referencePH || '',
      };
    }
  }

  resetRecord(): void {
    this.record = {
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

  saveRecord(): void {
    console.log(this.record);

    // Verifica que los campos no estén vacíos
    if (this.record.id === null) {
      // Llamada al servicio para crear un nuevo registro
      this._Service
        .createConsultant({
          name: this.record.name,
          email: this.record.email,
          phone: this.record.phone,
          description: this.record.description,
          referencePH: this.record.referencePH,
        })
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
    } else if (this.record.id !== null) {
      // Llamada al servicio para actualizar un registro existente
      this._Service
        .updateConsultant(this.record.id, {
          name: this.record.name,
          email: this.record.email,
          phone: this.record.phone,
          description: this.record.description,
          referencePH: this.record.referencePH,
        })
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
