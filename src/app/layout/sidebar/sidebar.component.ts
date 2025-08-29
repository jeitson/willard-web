import { AfterViewInit, Component, DoCheck, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Auth0Service } from 'src/app/core/services/auth0.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { UsersService } from 'src/app/core/services/security/users.service';
import { StorageService } from 'src/app/core/services/storage.service';

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
  nameUser: string = '';
  private activeSubMenu: HTMLElement | null = null;
  private rolSubscription: any;
  private rolTimer: any;

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private http: GeneralService,
    private _users: UsersService,
    private _storage: StorageService) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.isCollapsed = false;
  }

  ngOnInit(): void {
    this.http.getMenu().subscribe({
      next: (menu: any) => {
        this.itemsMenu = menu;
        this.initUserData();
      },
      error: (err) => {
        console.error('Error al obtener el menú:', err);
      }
    });
  }

  private initUserData(): void {
    this._storage.getData().subscribe({
      next: (response) => {
        if (response) {
          this.handleStoredUserData(response);
        } else {
          this.fetchAndStoreUserProfile();
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos almacenados:', err);
      }
    });
  }

  private handleStoredUserData(response: any): void {
    this.role = sessionStorage.getItem("RoleId") || '';
    this.nameUser = response.name;

    // if (this.role) {
    //   this.name = response.roles?.[0]?.role.name || '';
    //   const modules = response.roles?.[0]?.role.menu || [];
    //   this.preloadModules(modules);
    // }
    if (this.role) {
      this.name = response.roles?.[0]?.role.name || '';
      const modules = response.roles?.[0]?.role.menu || [];
      
      // Agregar los nuevos children al módulo con id "2"
      const targetModule = modules.find((m: any) => m.id === "2" && m.type === "sub" && Array.isArray(m.children));
      if (targetModule) {
      targetModule.children.push({ id: "28" }, { id: "29" }, { id: "30" });
      }
      
      this.preloadModules(modules);
      }
  }

  private fetchAndStoreUserProfile(): void {
    this._users.getProfile().subscribe({
      next: (response) => {
        const profileData = response?.data;
        if (profileData) {
          this._storage.setData(profileData);
          sessionStorage.setItem('profileData', JSON.stringify(profileData));
          const roleId = profileData.roles?.[0]?.roleId || '';
          sessionStorage.setItem('RoleId', roleId);

          this.name = profileData.roles?.[0]?.role.name || '';
          this.role = roleId;
          const modules = profileData.roles?.[0]?.role.menu || [];
          this.preloadModules(modules);
        }
      },
      error: (err) => {
        console.error('Error al obtener el perfil del usuario:', err);
      }
    });
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
        }).filter((x: any) => x.status === true);
      } else if (savedModule && savedModule.type === 'link') {
        // Si es un módulo link, marcar como true
        module.status = true;
      }

      return module;
    }).filter((x: any) => x.status === true);
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
