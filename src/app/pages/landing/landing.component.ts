import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

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
        this.loading = true;
        window.history.replaceState({}, document.title, window.location.pathname);
        this.router.navigate(['/main/dashboard']);
      } else {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
  }

  login(){
    this.auth.loginWithRedirect();
  }
}
