import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/core/services/security/roles.service';
import { Observable, Subject, forkJoin, fromEvent } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { GeneralService } from 'src/app/core/services/general.service';
declare var bootstrap: any;
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
    menu:[]
  };
  listData: any = [];
  viewoptions = true;
  activeSection: string | null = null;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  modulesBase: any[] = [];
  modules: any[] = [];
  modal: any;
  mmenu: any;
  constructor(private _rolesService: RolesService, private _toast: ToastService, private general:GeneralService) {}
  ngOnInit(): void {
    this.general.getMenu().subscribe({
      next: (mods: any)=>{
        this.modulesBase = mods;
      }
    });
    this.modal = new bootstrap.Modal(document.getElementById('modalRol'), {backdrop: 'static', keyboard: false});
    this.mmenu = new bootstrap.Modal(document.getElementById('modalMenu'), {backdrop: 'static', keyboard: false});
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
      menu: [],
    };
  }

  close() {
    this.modal.hide();
  }

  openModalMenu(item: any){
    if(item.menu.length > 0){
      this.modules = JSON.parse(JSON.stringify([]));
      this.modules = this.preloadModules(item.menu)
      this.mmenu.show();
    } else {
      this._toast.info('Importante', 'No hay menu asignado para este rol');
    }
  }

  createAndUpdte(item: any | null): void {
    this.clearDta();
    this.action.name = 'Crear';
    this.viewoptions = true;
    this.modal.show();
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.role = {
        id: item.id,
        name: item.name,
        description: item.description,
        menu: item.menu,
      };
      if(this.role.menu === null || this.role.menu.length === 0){
        this.modules = this.modulesBase;
      } else {
        this.modules = this.preloadModules(this.role.menu);
      }
    }
  }

  preloadModules = (savedModules: any[]) => {
    const modules = JSON.parse(JSON.stringify(this.modulesBase));
    return modules.map((module: any) => {
      // Buscar si el módulo existe en los guardados
      const savedModule = savedModules.find(saved => saved.id === module.id);

      // Si es un submódulo, verificar los hijos
      if (savedModule && savedModule.type === 'sub' && module.subMenu) {
        // Marcar el módulo padre como true
        module.status = true;

        // Recorrer y marcar los hijos cuyo id está en savedModule.children
        module.subMenu = module.subMenu.map((subItem: any) => {
          const savedChild = savedModule.children.find((child: any) => child.id === subItem.id);
          if (savedChild) {
            subItem.status = true; // Marcar los hijos en true si coinciden
          }
          return subItem;
        });
      } else if (savedModule && savedModule.type === 'link') {
        // Si es un módulo link, marcar como true
        module.status = true;
      }

      return module;
    });
  };

  updateRole(): void {
    if (this.role.id) {
      const data = {
        ...this.role,
        menu: this.filterModulesWithTrueStatus()
      };
      this._rolesService
        .updateRol(this.role.id, data)
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createRole(): void {
    const data = {
      ...this.role,
      menu: this.filterModulesWithTrueStatus()
    };
    this._rolesService.createRol(data).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  toggleParent(module: any) {
    if (!module.subMenu) return;

    // Si se selecciona el padre, seleccionar todos los hijos
    module.subMenu.forEach((sub: any) => sub.status = module.status);
  }

  toggleSubMenu(module: any) {
    if (!module.subMenu) return;
    // Si algún hijo está seleccionado, el padre debe estar seleccionado
    module.status = module.subMenu.some((sub: any) => sub.status);
  }

  toggleSection(section: string) {
    if (this.activeSection === section) {
      // Si ya está activa, la cierra
      this.activeSection = null;
    } else {
      // Si no, la abre y cierra las demás
      this.activeSection = section;
    }
  }

  filterModulesWithTrueStatus = () => {
    return this.modules
      .filter((module: any) => module.status === true || module.type === 'sub')
      .map((module: any) => {
        if (module.type === 'sub') {
          // Filtrar los submenús con status en true
          const children = module.subMenu
            .filter((subItem: any) => subItem.status === true)
            .map((subItem: any) => ({ id: subItem.id }));

          // Si tiene hijos en true, incluirlos en el array de children
          if (children.length > 0) {
            return {
              type: module.type,
              id: module.id,
              children: children
            };
          }
        } else if (module.status === true) {
          // Si es un módulo normal con status true
          return {
            type: module.type,
            id: module.id
          };
        }
        return null; // No devuelve si no cumple con las condiciones
      })
      .filter(Boolean); // Filtrar los null
  };

  handleSuccess(response: any): void {
    this.selectData();
    this.close();
  }
}
