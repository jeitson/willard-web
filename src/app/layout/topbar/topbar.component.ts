import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth0Service } from 'src/app/core/services/auth0.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, AfterViewInit {

  name: string = '';
  role: string = '';
  user: any = {};
  constructor(private storageService:StorageService, private auth0Service:Auth0Service){}

  async ngAfterViewInit(){
    this.auth0Service.getUser().subscribe(user => {
      this.user = user;
    });
    if (!(await this.auth0Service.isAuthenticated())) {
      this._login();
    }
  }

  ngOnInit(): void {
    // this.name = this.capitalizeTexto(JSON.parse(sessionStorage.getItem("currentUser") || '{}').name.toLowerCase());
    // this.role = JSON.parse(sessionStorage.getItem("currentUser") || '{}').role.name
  }

  capitalizeTexto(texto: string) {
    return texto.toLowerCase().split(' ').map(palabra => {
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    }).join(' ');
  }

  _logout(): void {
    this.storageService.setHasReloaded(false);
    this.auth0Service.logout();
  }

  _login(): void {
    this.auth0Service.login();
  }

}
