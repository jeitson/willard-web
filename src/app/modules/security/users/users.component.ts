import { Component } from '@angular/core';
import { RolesService } from 'src/app/core/services/security/roles.service';
import { UsersService } from 'src/app/core/services/security/users.service';
import { Observable, Subject, forkJoin, fromEvent, identity } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';

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
  user = {
    id: null,
    authId: '',
    name: '',
    description: '',
    email: '',
    role: '',
  };
  listData: any;
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
  ) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('userModal'), {backdrop: 'static', keyboard: false})
    this.selectData();
  }

  selectData(): void {
    // Obtener todos los usuarios
    this.userService.allUsers().subscribe({
      next: (usersResponse: any) => {
        const users = usersResponse.data.items;
        this.users = users;
        this.pagination = usersResponse.meta;
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
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.user = {
        id: item.id ?? '',
        authId: null ?? '',
        name: item.name ?? '',
        description: item.description ?? '',
        email: item.email ?? '',
        role: item.roles?.[0]?.roleId ?? '',
      };
    }
  }


  updateeUser(): void {
    if (this.user.id) {
      this.userService
        .updateUser(this.user.id, this.geteUserPayload())
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
  }

  createeUser(): void {
    this.userService.createUser(this.geteUserPayload()).subscribe({
      next: (response: any) => {
        this.selectData();
        this.modal.hide();
        this._toast.success('Completado','Usuario creado exitosamente')
      },
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  geteUserPayload() {
    const { id, authId, name, description, email, role } = this.user;

    return {
      authId,
      name,
      description,
      email,
      roles: [Number(role)],
    };
  }

  resetUser(): void {
    this.user = {
      id: null,
      authId: '',
      name: '',
      description: '',
      email: '',
      role: '',
    };
  }
}
