import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/core/services/security/roles.service';
import { Observable, Subject, forkJoin, fromEvent } from 'rxjs';
declare var $: any;
@Component({
  selector: 'wlrd-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  switchSection: string = 'List';
  actionModal: string = '';
  showForm = false;
  role = {
    id: null,
    name: '',
    description: '',
  };
  listData: any = [];
  viewoptions = true;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  constructor(private _rolesService: RolesService) {}
  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    this._rolesService.allRoles().subscribe({
      next: (value: any) => {
        console.log(value);
        this.listData = value.data.items;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  clearDta() {
    this.role = {
      id: null,
      name: '',
      description: '',
    };
  }

  close() {
    $('#modalRol').modal('hide');
  }

  createAndUpdte(item: any | null): void {
    this.clearDta();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalRol').modal('show');
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.role = {
        id: item.id,
        name: item.name,
        description: item.description,
      };
    }
  }

  updateRole(): void {
    if (this.role.id) {
      this._rolesService
        .updateRol(this.role.id, this.getRolePayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createRole(): void {
    this._rolesService.createRol(this.getRolePayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  getRolePayload() {
    const { id, name, description } = this.role;

    return {
      id,
      name,
      description,
    };
  }

  handleSuccess(response: any): void {
    this.selectData();
    this.close();
  }
}
