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
    referencePH: '',
    roles: [],
    collectionSites: [],
  };
  listData: any;
  listCollections: any[] = [];
  viewoptions = true;
  action: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  modal: any;
  listBase: any[] = [];
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
    private http: ApiService
  ) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('userModal'), {
      backdrop: 'static',
      keyboard: false,
    });
    this.loadUsers(this.currentPage);
    this.loadRoles();
    this.listCollectionCopy();
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




  loadUsers(item: any): void {
    this.userService.allUsers().subscribe({
      next: (response: any) => {
        const users = response.data.items;
        this.users = users;
        this.listBase = users;
        this.totalItems = response.data.meta.totalItems; // Total de solicitudes
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage); // Total de páginas
        this.updatePaginatedList(); // Actualiza la lista paginada
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
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
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    this.modal.show();
    if (item != null) {
      this.userId = item.id;
      this.role = item.roles[0].roleId;
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
        collectionSites: item.collectionSites,
      };
    }
  }

  updateeUser(): void {
    const data = {
      ...this.user,
      roles: [Number(this.role)],
      collectionSites: [Number(this.collectionSites)],
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
      roles: [],
      collectionSites: [],
    };
  }
  
   // paginación
   updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.users.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage); // Calcula el total de páginas
  }
  
  onPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPage = Number(selectElement.value);
    this.goToPage(selectedPage);
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList(); // Actualiza la lista para la nueva página
    }
  }
  get pagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }
  
  onSearchChange(value: string): void {
    if (!value) {
      this.users = [...this.listBase]; // Restablecer la lista original si no hay búsqueda
    } else {
      this.users = this.listBase.filter((item: any) => {
        const itemValues: any = Object.values(item);
        return itemValues.some((val: string) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        );
      });
    }
    this.currentPage = 1; // Reinicia a la primera página
    this.updatePaginatedList(); // Actualiza la lista paginada después del filtrado
  }

}
