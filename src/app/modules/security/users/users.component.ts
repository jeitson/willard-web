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
    forkJoin({
      users: this.userService.allUsers(),
      roles: this.rolesService.allRoles(),
    }).subscribe({
      next: ({ users, roles }) => {
        console.log(users);
        console.log(roles);
        this.users = users.data.items;
        this.listData = roles.data.items;
      },
      error: (error: any) => {
        console.error('Error loading data:', error);
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
        authId: item.id ?? '',
        name: item.name ?? '',
        description: item.description ?? '',
        email: item.email ?? '',
        role: item.roles?.[0]?.roleId ?? '',
      };
    }
  }


  saveUser(): void {
    console.log(this.user);
    if (
      this.user.name.trim() &&
      this.user.description.trim() &&
      this.user.email.trim() &&
      this.user.role.trim()
    ) {


      if (this.user.id === null) {
        this.userService
          .createUser({
            OauthId: this.user.authId,
            name: this.user.name,
            description: this.user.description,
            email: this.user.email,
            roles: [Number(this.user.role)],
          })
          .subscribe({
            next: (response: any) => {
              console.log('User created successfully:', response);
              this.selectData(); // Refresh the list of users after creating a new one
              this.close();
            },
            error: (error: any) => {
              console.error('Error creating user:', error);
            },
          });
      } else {
        this.userService
          .updateUser(this.user.id, {
            OauthId: this.user.authId,
            name: this.user.name,
            description: this.user.description,
            email: this.user.email,
            roles: [Number(this.user.role)],
          })
          .subscribe({
            next: (response: any) => {
              console.log('User updated successfully:', response);
              this.selectData(); // Refresh the list of users after updating an existing one
              this.close();
            },
            error: (error: any) => {
              console.error('Error updating user:', error);
            },
          });
      }
    } else {
      console.log('Please complete all fields.');
    }
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
