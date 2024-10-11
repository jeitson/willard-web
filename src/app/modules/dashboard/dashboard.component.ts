import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/security/users.service';

@Component({
  selector: 'wlrd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private _users: UsersService) {}

  ngOnInit(): void {
    this.getProfile();
  }

getProfile(): void {
  this._users.getProfile().subscribe({
    next: response => {
      if (response?.data) {
        const roleId = response?.data.roles?.[0]?.roleId || null;
        // Convertir el objeto data a una cadena JSON y guardarlo en sessionStorage
        sessionStorage.setItem('profileData', JSON.stringify(response.data));
        sessionStorage.setItem('RoleId', roleId);

        console.log('Datos guardados en sessionStorage:', response.data);
      } else {
        console.error('No se encontraron datos en la respuesta.');
      }
    },
    error: err => {
      console.error('Error al obtener el perfil:', err);
    }
  });
}

}
