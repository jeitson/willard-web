import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs';

@Component({
  selector: 'wlrd-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router){

  }

  ngOnInit(): void {
    // this.auth.user$.subscribe(r => {
    //   console.log(r)
    // })
    // return;
    this.auth.isAuthenticated$.subscribe(isAuthenticaded => {
      if(isAuthenticaded){
        this.router.navigate(['/main/dashboard']);
      }
    })
  }

  login(){
    this.auth.loginWithRedirect();
  }
}
