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

  p:number = 1;
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
    collectionSites: []
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
  constructor(
    private userService: UsersService,
    private rolesService: RolesService,
    private _toast: ToastService,
    private http: ApiService
  ) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('userModal'), {backdrop: 'static', keyboard: false})
    this.selectData();
    this.listCollectionCopy();
  }

  listCollectionCopy(){
    this.http.get('collection-sites').subscribe({
      next: (response: any) => {
        this.listCollections = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener centros de recolección:', error);
      },
    });
  }

  selectData(): void {
    // Obtener todos los usuarios
    this.userService.allUsers().subscribe({
      next: (usersResponse: any) => {
        const users = usersResponse.data.items;
        this.users = users;
        this.pagination = usersResponse.data.meta;
        // Obtener todos los roles
        this.rolesService.allRoles().subscribe({
          next: (rolesResponse: any) => {
            const roles = rolesResponse.data.items;
            this.listData = roles;
          },
          error: (error: any) => {
            console.error('Error loading roles:', error);
          },
        });
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
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
      this.role = item.roles[0].roleId
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
        collectionSites: [Number(this.collectionSites)]
      }
      this.userService
        .updateUser(this.userId, data)
        .subscribe({
          next: (response: any) => {
            this.selectData();
            this._toast.success('Completado','Usuario actualizado exitosamente');
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
      collectionSites: [Number(this.collectionSites)]
    }
    this.userService.createUser(data).subscribe({
      next: (response: any) => {
        this.selectData();
        this.modal.hide();
        this._toast.success('Completado','Usuario creado exitosamente')
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
      collectionSites: []
    }
  }
}
