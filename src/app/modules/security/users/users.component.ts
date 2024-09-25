import { Component } from '@angular/core';
import { RolesService } from 'src/app/core/services/security/roles.service';
import { UsersService } from 'src/app/core/services/security/users.service';
import { Observable, Subject, forkJoin, fromEvent, identity } from 'rxjs';

declare var $: any;
@Component({
  selector: 'wlrd-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
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
  constructor(
    private userService: UsersService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    // Obtener todos los usuarios
    this.userService.allUsers().subscribe({
      next: (usersResponse: any) => {
        const users = usersResponse.data.items;
        this.users = users;
  
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
    $('#userModal').modal({ backdrop: 'static', keyboard: false });
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
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createeUser(): void {
    this.userService.createUser(this.geteUserPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
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
      role: [Number(role)],
    };
  }

  handleSuccess(response: any): void {
    this.selectData();
    this.close();
  }
  close() {
    $('#userModal').modal('hide');
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
