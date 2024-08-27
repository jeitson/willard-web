import { Injectable } from '@angular/core';
import { Auth0Service } from './auth0.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private _menu: any[] = [];
  private staticMenu = [
    {
      icon: 'fa-solid fa-home',
      title: 'Dashboard',
      link: 'dashboard',
      children: null
    },
    {
      icon: 'fa-solid fa-gear',
      title: 'Configuraciones',
      link: null,
      children: [
        {
          title: 'Pais',
          link: 'settings/country'
        },
        {
          title: 'Departamento',
          link: 'settings/department'
        },
        {
          title: 'Ciudad',
          link: 'settings/city'
        },
        {
          title: 'Tipos sedes acopio',
          link: 'settings/headquartercopy'
        },
        {
          title: 'Tipo lugar de recogida ',
          link: 'settings/locationdeparture'
        },
        {
          title: 'Tipos de documento',
          link: 'settings/typedocuments'
        },
        {
          title: 'Unidad de medida',
          link: 'settings/unitymetrics'
        },
        {
          title: 'Tipo producto',
          link: 'settings/typeproducts'
        },
        {
          title: 'Tipo guía',
          link: 'settings/typeguide'
        },
        {
          title: 'Tipo evidencia',
          link: 'settings/typeevidence'
        },
        {
          title: 'Zona',
          link: 'settings/zone'
        },
        {
          title: 'Tipo de Camión',
          link: 'settings/trucktype'
        },
        {
          title: 'Tipo de Cliente',
          link: 'settings/typecustomer'
        },
        {
          title: 'Estado de rutas',
          link: 'settings/routestatus'
        },
        {
          title: 'Productos',
          link: 'settings/product'
        },
        {
          title: 'Clientes',
          link: 'settings/customer'
        },
        {
          title: 'Sedes de Acopio',
          link: 'settings/collection'
        },
        {
          title: 'Transportador',
          link: 'settings/conveyor'
        },
        {
          title: 'Asesor',
          link: 'settings/adviser'
        }
      ]
    },
    {
      icon: 'fa-solid fa-person-dots-from-line',
      title: 'Proceso',
      link: null,
      children: [
        {
          title: 'Solicitudes (planeador)',
          link: 'process/requestplanner'
        },
        {
          title: 'Solicitudes (Agencia)',
          link: 'process/requestagency'
        }
      ]
    },
    {
      icon: 'fa-solid fa-lock',
      title: 'Acceso',
      link: null,
      children: [
        {
          title: 'Usuarios',
          link: 'security/users'
        },
        {
          title: 'Roles',
          link: 'security/roles'
        },
        {
          title: 'Auditoria',
          link: 'security/request'
        }
      ]
    },
  ];

  constructor(private auth0Service: Auth0Service) {
    // this.auth0Service.user$.subscribe((user) => {
    //   if (user) {
    //     let roles: string[] = [];
    //     const userRoles = user['https://woomi.bateriaswillard.com/roles'];

    //     if (Array.isArray(userRoles)) {
    //       roles = userRoles;
    //     } else if (typeof userRoles === 'string') {
    //       roles = [userRoles];
    //     }

    //     // Encuentra el primer rol que coincide con appRoles
    //     const userRole = roles.find((role: string) => appRoles.includes(role));

    //     if (userRole) {
    //       this._menu = roleRoutes[userRole] || roleRoutes['none'] || [];
    //     } else {
    //       this._menu = roleRoutes['none'] || [];
    //     }
    //   }
    // });
  }

  get menu() {
    return this._menu.length > 0 ? this._menu : this.staticMenu;
  }
}
