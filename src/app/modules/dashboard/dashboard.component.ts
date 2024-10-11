import { Component, OnInit } from '@angular/core';
import { Auth0Service } from 'src/app/core/services/auth0.service';
import { UsersService } from 'src/app/core/services/security/users.service';

@Component({
  selector: 'wlrd-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {}

}
