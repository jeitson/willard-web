import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/core/services/security/roles.service';
import { Observable, Subject, forkJoin, fromEvent } from 'rxjs';
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
  modulesBase = [
    {
      route: 'dashboard',
      short_label: 'D',
      name: 'Inicio',
      type: 'link',
      status: false,
      id: '1',
      icon: 'ai-dashboard'
    },
    {
      route: 'process',
      short_label: 'P',
      name: 'Proceso',
      type: 'sub',
      status: false,
      id: '2',
      icon: 'ai-settings-horizontal',
      subMenu: [
        {
          name: 'Solicitudes (planeador)',
          type: 'link',
          id: '21',
          route: 'requestplanner',
          status: false
        },
        {
          name: 'Solicitudes (Agencia)',
          type: 'link',
          id: '22',
          route: 'requestagency',
          status: false
        },
        {
          name: 'Solicitudes (logistics)',
          type: 'link',
          id: '23',
          route: 'requestlogistics',
          status: false
        },
        {
          name: 'Recepción',
          type: 'link',
          id: '24',
          route: 'reception',
          status: false
        }
      ]
    },
    {
      route: 'security',
      short_label: 'P',
      name: 'Seguridad',
      type: 'sub',
      status: false,
      id: '3',
      icon: 'ai-lock-on',
      subMenu: [
        {
          name: 'Usuarios',
          type:'link',
          id: '31',
          route: 'users',
          status: false
        },
        {
          name: 'Roles',
          type:'link',
          id: '32',
          route: 'roles',
          status: false
        },
        {
          name: 'Auditoria',
          type:'link',
          id: '33',
          route: 'request',
          status: false
        }
      ]
    },
    {
      route: 'settings',
      short_label: 'C',
      name: 'Configuraciones',
      type: 'sub',
      status: false,
      id: '4',
      icon: 'ai-gear',
      subMenu: [
        {
          name: 'Pais',
          type: 'link',
          id: '41',
          route: 'country',
          status: false
        },
        {
          name: 'Departamento',
          type: 'link',
          id: '42',
          route: 'department',
          status: false
        },
        {
          name: 'Ciudad',
          type: 'link',
          id: '43',
          route: 'city',
          status: false
        },
        {
          name: 'Tipos sedes acopio',
          type: 'link',
          id: '44',
          route: 'headquartercopy',
          status: false
        },
        {
          name: 'Tipo lugar de recogida ',
          type: 'link',
          id: '45',
          route: 'locationdeparture',
          status: false
        },
        {
          name: 'Tipos de documento',
          type: 'link',
          id: '46',
          route: 'typedocuments',
          status: false
        },
        {
          name: 'Unidad de medida',
          type: 'link',
          id: '47',
          route: 'unitymetrics',
          status: false
        },
        {
          name: 'Tipo producto',
          type: 'link',
          id: '48',
          route: 'typeproducts',
          status: false
        },
        {
          name: 'Tipo guía',
          type: 'link',
          id: '49',
          route: 'typeguide',
          status: false
        },
        {
          name: 'Tipo evidencia',
          type: 'link',
          id: '410',
          route: 'typeevidence',
          status: false
        },
        {
          name: 'Zona',
          type: 'link',
          id: '411',
          route: 'zone',
          status: false
        },
        {
          name: 'Tipo de Camión',
          type: 'link',
          id: '412',
          route: 'trucktype',
          status: false
        },
        {
          name: 'Tipo de Cliente',
          type: 'link',
          id: '413',
          route: 'typecustomer',
          status: false
        },
        {
          name: 'Motivo Especial',
          type: 'link',
          id: '414',
          route: 'specialreason',
          status: false
        },
        {
          name: 'Estado de rutas',
          type: 'link',
          id: '415',
          route: 'routestatus',
          status: false
        },
        {
          name: 'Productos',
          type: 'link',
          id: '416',
          route: 'product',
          status: false
        },
        {
          name: 'Clientes',
          type: 'link',
          id: '417',
          route: 'customer',
          status: false
        },
        {
          name: 'Sedes de Acopio',
          type: 'link',
          id: '418',
          route: 'collection',
          status: false
        },
        {
          name: 'Transportador',
          type: 'link',
          id: '419',
          route: 'conveyor',
          status: false
        },
        {
          name: 'Asesor',
          type: 'link',
          id: '420',
          route: 'adviser',
          status: false
        },
        {
          name: 'Lugares de Recogida',
          type: 'link',
          id: '421',
          route: 'pickuplocation',
          status: false
        }
      ]
    },
  ];
  modules: any[] = [];
  modal: any;
  mmenu: any;
  constructor(private _rolesService: RolesService) {}
  ngOnInit(): void {
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
    this.modules = JSON.parse(JSON.stringify([]));
    this.modules = this.preloadModules(item.menu)
    this.mmenu.show();
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
