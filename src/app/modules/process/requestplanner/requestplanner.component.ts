import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
declare var $: any;
@Component({
  selector: 'wlrd-requestplanner',
  templateUrl: './requestplanner.component.html',
  styleUrls: ['./requestplanner.component.scss']
})
export class RequestplannerComponent implements OnInit {

  formRequest: any = {
    collectionRequestId: 0,
    routeStatusId: 0,
    name: '',
    description: '',
    confirmedPickUpDate: '',
    tripStartDate: '',
    tripStartTime: '',
    tripEndDate: '',
    tripEndTime: '',
    plate: '',
    truckTypeId: 0,
    deliveryDateToCollectionSite: '',
  }
  listsrequest: any[] = [
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
  requestId: string = '';
  action: any = {
    icon:'',
    name:'',
    value:'',
    color:''
  };
  lists: any = {
    listTruckType: [],
  }

  constructor(private _router: Router, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getRequests();
    this.getList('TIPO_CAMION', 'listTruckType');
  }

  getRequests(){
    this.api.get(`collection-request`).subscribe({
      next: (response: any) => {
        this.listsrequest = response.data.items;
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }

  getList(key: string, listName: string){
    this.api.get(`catalogs/key/${key}`).subscribe({
      next: (response: any) => {
        this.lists[listName] = response.data;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  viewDetail(item: any) {
    this._router.navigateByUrl(`main/requestplanner/${item.id}`);
  }

  editRequest(item: any){
    this.formRequest.collectionRequestId = item.id;
    $("#modalplaner").modal({backdrop: 'static', keyboard: false});
  }

  confirmRequest(){
    this.action.name = 'Confirmar';
    this.action.value = 'confirm';
    this.action.color = '#698e47';
    this.action.icon = 'fa-solid fa-check';
    $("#modalconfirm").modal({backdrop: 'static', keyboard: false, opacity:false});
  }

  actionConfirm(){
    switch (this.action.value) {
      case 'confirm':
        this.save();
      break;
      case 'reject':
        //this.save();
      break;
      default:
        break;
    }
  }

  save(){
    const data = {
      ...this.formRequest
    };
    this.api.post(`routes`, data).subscribe({
      next: (response: any) => {
        //this.listKey();
        $("#modalplaner").modal("hide");
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

}
