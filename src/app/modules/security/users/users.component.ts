import { Component } from '@angular/core';
import { RolesService } from 'src/app/core/services/security/roles.service';
import { UsersService } from 'src/app/core/services/security/users.service';
import { Observable, Subject, forkJoin, fromEvent, identity } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { ApiService } from 'src/app/core/services/api/api.service';

declare var bootstrap: any;
@Component({
  selector: 'wlrd-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  p: number = 1;
  totalItemsRender: number = 10;
  pagination: any = {};
  currentSection: string = 'List';
  actionModal: string = '';
  showForm = false;
  users: any[] = [];
  collectionSites = '';
  zone = '';
  role = '';
  userId = '';
  user = {
    oauthId: '',
    name: '',
    description: '',
    cellphone: '',
    email: '',
    password: '',
    referenceWLL: '',
    transporterId: '',
    referencePH: '',
    roles: [],
    collectionSites: [],
    zones: [],
  };
  listData: any;
  listCollections: any[] = [];
  listZones: any[] = [];
  viewoptions = true;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  modal: any;
  listBase: any[] = [];
  listTransporters: any[] = [];
  paginatedList: any = [];
  searchTerm$ = new Subject<any>();
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  totalItems = 0;
  itemsPerPage: number = 10; // Cambiar a 10 para que se muestren 10 usuarios por página
  totalPages: number = 0;
  currentPage: number = 1;
  constructor(
    private userService: UsersService,
    private rolesService: RolesService,
    private _toast: ToastService,
    private http: ApiService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('userModal'), {
      backdrop: 'static',
      keyboard: false,
    });
    this.loadUsers(this.currentPage);
    this.loadRoles();
    this.listCollectionCopy();
    this.getTransporter();
    this.getZona();
  }

  listCollectionCopy() {
    this.http.get('collection-sites').subscribe({
      next: (response: any) => {
        this.listCollections = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener centros de recolección:', error);
      },
    });
  }

  getZona() {
    this.http.get('catalogs/key/ZONA').subscribe({
      next: (response: any) => {
        this.listZones = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener las zonas', error);
      },
    });
  }

  getTransporter() {
    this.http.get('transporters').subscribe({
      next: (response: any) => {
        this.listTransporters = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener las zonas', error);
      },
    });
  }

  loadUsers(item: any): void {
    this.api.get(`users?page=${item}`).subscribe({
      next: (response: any) => {
        this.users = response.data.items;
        this.listBase = this.users; // Guarda la lista original para filtrar
        this.totalItems = response.data.meta.totalItems; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de páginas
        this.search();
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  loadRoles(): void {
    this.rolesService.allRoles().subscribe({
      next: (rolesResponse: any) => {
        const roles = rolesResponse.data.items;
        this.listData = roles; // Guardamos los roles
      },
      error: (error: any) => {
        console.error('Error loading roles:', error);
      },
    });
  }

  createOrUpdateUser(item: any | null): void {
    console.log(item);
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    this.modal.show();
    if (item != null) {
      this.userId = item.id;
      this.role = item.roles[0]?.roleId;
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.user = {
        oauthId: item.oauthId,
        name: item.name,
        description: item.description,
        cellphone: item.cellphone,
        email: item.email,
        password: item.password,
        referenceWLL: item.referenceWLL,
        referencePH: item.referencePH,
        roles: item.roles,
        transporterId: item.transporterId,
        collectionSites:
          item.userCollectionSites.length > 0
            ? item.userCollectionSites[0].collectionSiteId
            : '',
        zones: item.zones.length > 0 ? item.zones[0].zoneId : '',
      };
     this.collectionSites =
        item.userCollectionSites.length > 0
          ? item.userCollectionSites[0].collectionSiteId
          : '';
      this.zone = item.zones.length > 0 ? item.zones[0].zoneId : '';
    }
  }

  updateeUser(): void {
    const data = {
      ...this.user,
      roles: [Number(this.role)],
      collectionSites: [Number(this.collectionSites)],
      zones: [Number(this.zone)],
    };
    this.userService.updateUser(this.userId, data).subscribe({
      next: (response: any) => {
        this.loadUsers(this.currentPage);
        this._toast.success('Completado', 'Usuario actualizado exitosamente');
        this.modal.hide();
      },
      error: (error: any) =>
        console.error('Error al actualizar el registro:', error),
    });
  }

  createeUser(): void {
    const data = {
      ...this.user,
      roles: [Number(this.role)],
      collectionSites: [Number(this.collectionSites)],
      zones: [Number(this.zone)],
    };
    this.userService.createUser(data).subscribe({
      next: (response: any) => {
        this.loadUsers(this.currentPage);
        this.modal.hide();
        this._toast.success('Completado', 'Usuario creado exitosamente');
      },
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  resetUser(): void {
    this.user = {
      oauthId: '',
      name: '',
      description: '',
      cellphone: '',
      email: '',
      password: '',
      referenceWLL: '',
      referencePH: '',
      transporterId: '',
      roles: [],
      collectionSites: [],
      zones: [],
    };
  }

  // paginación
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.users.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
      this.loadUsers(page);
    }
  }

  onPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPage = Number(selectElement.value);
    this.goToPage(selectedPage);
  }

  get pagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      this.users = this.listBase.filter((item) => {
        // Comprobamos si alguno de los roles del usuario contiene el término de búsqueda
        const rolesMatch = item.roles?.some((role: any) =>
          role.role.name.toLowerCase().includes(value.toLowerCase())
        );

        // También permitimos filtrar por cualquier otro campo del objeto usuario
        const itemValues = Object.values(item);
        const generalMatch = itemValues.some((item) =>
          String(item).toLowerCase().includes(value.toLowerCase())
        );

        // El filtro se activa si cualquiera de las condiciones de coincidencia se cumple
        return rolesMatch || generalMatch;
      });
    });
  }
}
