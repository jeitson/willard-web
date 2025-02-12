import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

const _location = location.hash.split('#');
let url = '';
if (_location.length > 0) {
  url = _location[_location.length -1 ];
}

if (url.includes('/landing') || !url) {
  url = '/main/dashboard';
}

@Component({
  selector: 'wlrd-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements AfterViewInit, OnInit {

  loading = true;

  constructor(public auth: AuthService, private router: Router){

  }

  ngAfterViewInit(){
    this.auth.isAuthenticated$.subscribe(isAuthenticaded => {
      if (isAuthenticaded) {
        window.history.replaceState({}, document.title, window.location.pathname);
        this.router.navigate([url]);
        this.loading = true;
      } else {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(isAuthenticaded => {
      if (isAuthenticaded) {
        window.history.replaceState({}, document.title, window.location.pathname);
        this.router.navigate([url]);
        this.loading = true;
      } else {
        this.loading = false;
      }
    })
  }

  login(){
    this.auth.loginWithRedirect();
  }
}
