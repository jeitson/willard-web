import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'wlrd-requestplanner',
  templateUrl: './requestplanner.component.html',
  styleUrls: ['./requestplanner.component.scss']
})
export class RequestplannerComponent implements OnInit {

  requests: any[] = [
    {
      id:1,
      dateRequest:'01/08/2024',
      acopiCenter:'La esperanza',
      count:100,
      place:'Oficinas Autoland',
      customer:'Autoland',
      transporter:'camiones la union',
      status: true,
    }
  ];

  constructor(private _router: Router) {

  }

  ngOnInit(): void {

  }

  viewDetail(item: any) {
    this._router.navigateByUrl(`main/requestplanner/${item.id}`);
  }

  editRequest(item: any){

  }

}
