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

  clearDta(){
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
    $('#modalRol').modal({ backdrop: 'static', keyboard: false });
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

  manageRole(): void {
    console.log(this.role);
    // Verifica que los campos no estén vacíos
    if (this.role.name.trim() && this.role.description.trim()) {
      if (this.role.id === null) {
        // Llamada al servicio para crear un nuevo rol
        this._rolesService.createRol({
          name: this.role.name,
          description: this.role.description,
        }).subscribe({
          next: (response) => {
            this.selectData();
            this.close();
          },
          error: (error) => {
            console.error('Error al crear rol:', error);
          },
        });
      } else if (this.role.id !== null) {
        // Llamada al servicio para actualizar un rol existente
        this._rolesService.updateRol(this.role.id, {
          name: this.role.name,
          description: this.role.description,
        }).subscribe(x=>{
          this.selectData();
          this.close();
        });


      }
    } else {
      // Muestra un mensaje de error si los campos están vacíos
      console.log('Por favor, completa todos los campos.');
    }
  }

  






}
