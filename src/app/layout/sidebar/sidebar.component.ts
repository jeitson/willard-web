import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Auth0Service } from 'src/app/core/services/auth0.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { UsersService } from 'src/app/core/services/security/users.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  @Input() isCollapsed: boolean = false;
  itemsMenu: any[] = [];
  items: any[] = [];
  name: string = '';
  role: string = '';

  private activeSubMenu: HTMLElement | null = null;
  private rolSubscription: any;
  private rolTimer: any;

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private http:GeneralService,
    private _users: UsersService) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.isCollapsed = false;
  }

  ngOnInit(): void {
    this.http.getMenu().subscribe({
      next: (menu: any)=>{
        this.itemsMenu = menu;
        this.role = sessionStorage.getItem("RoleId") || '';
        if(this.role !== ''){
          this.name = JSON.parse(sessionStorage.getItem("profileData") || '{}')?.roles[0].role.name;
          console.log(JSON.parse(sessionStorage.getItem("profileData") || '{}'));
          const modules = JSON.parse(sessionStorage.getItem("profileData") || '{}')?.roles[0].role.menu
          this.preloadModules(modules);
        } else {
          this._users.getProfile().subscribe({
            next: response => {
              if (response?.data) {
                const roleId = response?.data.roles?.[0]?.roleId || null;
                sessionStorage.setItem('profileData', JSON.stringify(response.data));
                sessionStorage.setItem('RoleId', roleId);
                this.name = JSON.parse(sessionStorage.getItem("profileData") || '{}')?.roles[0].role.name;
                this.role = sessionStorage.getItem("RoleId") || '';
                const modules = JSON.parse(sessionStorage.getItem("profileData") || '{}')?.roles[0].role.menu
                this.preloadModules(modules);
              }
            }
          });
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.rolSubscription.unsubscribe();
  }

  preloadModules = (savedModules: any[]) => {
    const modules = JSON.parse(JSON.stringify(this.itemsMenu));
    this.items = modules.map((module: any) => {
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
        }).filter((x:any)=> x.status === true);
      } else if (savedModule && savedModule.type === 'link') {
        // Si es un módulo link, marcar como true
        module.status = true;
      }

      return module;
    }).filter((x:any)=>x.status === true);
    setTimeout(() => {
      const subMenus = this.el.nativeElement.querySelectorAll(".sub-menu") as NodeListOf<HTMLElement>;
      const buttons = this.el.nativeElement.querySelectorAll(".sidebar ul a") as NodeListOf<HTMLButtonElement>;
      buttons.forEach(button => {
        this.renderer.listen(button, 'click', () => this.clickIn(button, subMenus, buttons));
      });
      this.setActiveModuleOnLoad();
    }, 100);
  };

  capitalizeTexto(texto: string) {
    return texto.toLowerCase().split(' ').map(palabra => {
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }).join(' ');
  }

<<<<<<< HEAD
  cargarMenu(rol: string) {
    console.log('Cargando menú para rol:', rol);
    // Carga el menú correspondiente al rol de usuario
    switch (rol.toString()) {
      case '22': //Administrator
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'settings',
            short_label: 'C',
            name: 'Configuraciones',
            type: 'sub',
            status: true,
            icon: 'ai-gear',
            subMenu: [
              {
                name: 'Pais',
                type: 'link',
                route: 'country'
              },
              {
                name: 'Departamento',
                type: 'link',
                route: 'department'
              },
              {
                name: 'Ciudad',
                type: 'link',
                route: 'city'
              },
              {
                name: 'Tipos sedes acopio',
                type: 'link',
                route: 'headquartercopy'
              },
              {
                name: 'Tipo lugar de recogida ',
                type: 'link',
                route: 'locationdeparture'
              },
              {
                name: 'Tipos de documento',
                type: 'link',
                route: 'typedocuments'
              },
              {
                name: 'Unidad de medida',
                type: 'link',
                route: 'unitymetrics'
              },
              {
                name: 'Tipo producto',
                type: 'link',
                route: 'typeproducts'
              },
              {
                name: 'Tipo guía',
                type: 'link',
                route: 'typeguide'
              },
              {
                name: 'Tipo evidencia',
                type: 'link',
                route: 'typeevidence'
              },
              {
                name: 'Zona',
                type: 'link',
                route: 'zone'
              },
              {
                name: 'Tipo de Camión',
                type: 'link',
                route: 'trucktype'
              },
              {
                name: 'Tipo de Cliente',
                type: 'link',
                route: 'typecustomer'
              },
              {
                name: 'Motivo Especial',
                type: 'link',
                route: 'specialreason'
              },
              {
                name: 'Estado de rutas',
                type: 'link',
                route: 'routestatus'
              },
              {
                name: 'Productos',
                type: 'link',
                route: 'product'
              },
              {
                name: 'Clientes',
                type: 'link',
                route: 'customer'
              },
              {
                name: 'Sedes de Acopio',
                type: 'link',
                route: 'collection'
              },
              {
                name: 'Transportador',
                type: 'link',
                route: 'conveyor'
              },
              {
                name: 'Lugares de Recogida',
                type: 'link',
                route: 'pickuplocation'
              }
            ]
          },
          {
            route: 'security',
            short_label: 'P',
            name: 'Seguridad',
            type: 'sub',
            status: true,
            icon: 'ai-lock-on',
            subMenu: [
              {
                name: 'Usuarios',
                type:'link',
                route: 'users'
              },
              {
                name: 'Roles',
                type:'link',
                route: 'roles'
              },
              {
                name: 'Auditoria',
                type:'link',
                route: 'request'
              }
            ]
          }
        ]));
      break;
      case '20': //Recuperadora
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'process',
            short_label: 'P',
            name: 'Proceso',
            type: 'sub',
            status: true,
            icon: 'ai-settings-horizontal',
            subMenu: [
              {
                name: 'Recepción',
                type: 'link',
                route: 'reception'
              },
            ]
          }
        ]));
      break;
      case '18': //AgenciaPh
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'process',
            short_label: 'P',
            name: 'Proceso',
            type: 'sub',
            status: true,
            icon: 'ai-settings-horizontal',
            subMenu: [
              {
                name: 'Recepción',
                type: 'link',
                route: 'reception'
              },
            ]
          }
        ]));
      break;
      case '14': //Planeador
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'process',
            short_label: 'P',
            name: 'Proceso',
            type: 'sub',
            status: true,
            icon: 'ai-settings-horizontal',
            subMenu: [
              {
                name: 'Solicitudes',
                type: 'link',
                route: 'requestplanner'
              },
              {
                name: 'Recepción',
                type: 'link',
                route: 'reception'
              },
            ]
          }
        ]));
      break;
      case '16': //Fabrica BW
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'process',
            short_label: 'P',
            name: 'Proceso',
            type: 'sub',
            status: true,
            icon: 'ai-settings-horizontal',
            subMenu: [
              {
                name: 'Solicitudes',
                type: 'link',
                route: 'requestagency'
              },
            ]
          }
        ]));
      break;
      case '13': //PH ASESOR \ PH AGENCIA
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'process',
            short_label: 'P',
            name: 'Proceso',
            type: 'sub',
            status: true,
            icon: 'ai-settings-horizontal',
            subMenu: [
              {
                name: 'Solicitudes',
                type: 'link',
                route: 'requestagency'
              },
            ]
          }
        ]));
      break;
      case '15': //WILLARD LOGISTICA
        this.items = JSON.parse(JSON.stringify([
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          },
          {
            route: 'process',
            short_label: 'P',
            name: 'Proceso',
            type: 'sub',
            status: true,
            icon: 'ai-settings-horizontal',
            subMenu: [
              {
                name: 'Solicitudes',
                type: 'link',
                route: 'requestlogistics'
              }
            ]
          }
        ]));
      break;
      default:
        this.items = [
          {
            route: 'dashboard',
            short_label: 'D',
            name: 'Inicio',
            type: 'link',
            status: true,
            icon: 'ai-dashboard'
          }
        ];
        break;
    };

    setTimeout(() => {
      const subMenus = this.el.nativeElement.querySelectorAll(".sub-menu") as NodeListOf<HTMLElement>;
    const buttons = this.el.nativeElement.querySelectorAll(".sidebar ul a") as NodeListOf<HTMLButtonElement>;

    buttons.forEach(button => {
      this.renderer.listen(button, 'click', () => this.clickIn(button, subMenus, buttons));
    });
    this.setActiveModuleOnLoad();
    }, 100);
  }

=======
>>>>>>> new-template
  setActiveModuleOnLoad(): void {
    const currentRoute = this.router.url; // Obtén la ruta actual.
    const menuItems = this.el.nativeElement.querySelectorAll(".sidebar ul li") as NodeListOf<HTMLLIElement>;

    menuItems.forEach(menuItem => {
      const link = menuItem.querySelector('a[routerLink]') as HTMLElement;
      const subMenu = menuItem.querySelector('.sub-menu') as HTMLElement | null;
      if (link) {
        const routerLink = link.getAttribute('routerLink');
        // Verifica si la ruta activa coincide con el enlace principal.
        if (routerLink && currentRoute.startsWith(routerLink)) {
          this.renderer.addClass(link, 'active');

          if (subMenu) {
            const ul = subMenu.querySelector('ul') as HTMLElement | null;
            if (ul) {
              this.renderer.setStyle(subMenu, 'height', `${ul.clientHeight}px`);
              this.activeSubMenu = subMenu; // Establece el submenú como activo.
            }
          }
        } else {
          this.renderer.removeClass(link, 'active');
        }
        // Verifica las rutas de los elementos del submenú.
        const subLinks = subMenu?.querySelectorAll('a[routerLink]') as NodeListOf<HTMLAnchorElement>;
        subLinks?.forEach(subLink => {
          const subRouterLink = subLink.getAttribute('routerLink');
          if (subRouterLink && currentRoute.includes(subRouterLink)) {
            this.renderer.addClass(subLink, 'active');
            this.renderer.setStyle(subMenu, 'height', `${subLink.parentElement?.scrollHeight}px`);
            this.activeSubMenu = subMenu; // Establece el submenú como activo.
          } else {
            this.renderer.removeClass(subLink, 'active');
          }
        });
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  clickIn(item: HTMLButtonElement, subMenus: NodeListOf<HTMLElement>, buttons: NodeListOf<HTMLButtonElement>): void {
    const subMenu = item.nextElementSibling as HTMLElement | null;
    const ul = subMenu?.querySelector("ul") as HTMLElement | null;

    // Si el botón no tiene un submenú asociado (elemento hermano), aplica la clase `active`.
    if (!subMenu || !ul) {
      buttons.forEach(button => this.renderer.removeClass(button, 'active'));
      this.renderer.addClass(item, 'active');
      return;
    }

    // Si hay un submenú activo y es diferente al actual, ciérralo.
    if (this.activeSubMenu && this.activeSubMenu !== subMenu) {
      this.renderer.setStyle(this.activeSubMenu, 'height', '0px');
      const activeButton = this.activeSubMenu.previousElementSibling as HTMLButtonElement | null;
      if (activeButton) {
        this.renderer.removeClass(activeButton, 'active');
      }
    }

    if (!subMenu.clientHeight) {
      this.renderer.setStyle(subMenu, 'height', `${ul.clientHeight}px`);
      this.activeSubMenu = subMenu; // Establece el submenú actual como activo.
    } else {
      this.renderer.setStyle(subMenu, 'height', '0px');
      this.activeSubMenu = null; // Restablece el submenú activo.
    }
  }
}
