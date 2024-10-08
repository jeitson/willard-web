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
        console.log(response);
      }
    })
  }
}
