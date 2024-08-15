import { Component } from '@angular/core';
import { Auth0Service } from 'src/app/core/services/auth0.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'wlrd-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent {
  constructor(private auth0Service: Auth0Service) {}
  /**
   * Logout the user
   */
  logout() {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Confirmas que deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'CANCELAR',
      confirmButtonText: 'CERRAR SESIÓN',
    }).then((result) => {
      if (result.value) {
        this._logout();
      }
    });
  }

  _logout(): void {
    this.auth0Service.logout();
  }
}
