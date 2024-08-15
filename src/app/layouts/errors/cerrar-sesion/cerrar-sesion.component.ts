import { Component } from '@angular/core';
import { Auth0Service } from 'src/app/core/services/auth0.service';

@Component({
  selector: 'wlrd-cerrar-sesion',
  templateUrl: './cerrar-sesion.component.html',
  styleUrls: ['./cerrar-sesion.component.scss'],
})
export class CerrarSesionComponent {
  constructor(
    private auth0Service: Auth0Service,
  ) {}

  login() {
    this.auth0Service.logout();
  }
}
