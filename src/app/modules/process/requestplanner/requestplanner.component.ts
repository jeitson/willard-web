import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ToastService } from 'src/app/core/services/toast.service';
declare var $: any;
@Component({
  selector: 'wlrd-requestplanner',
  templateUrl: './requestplanner.component.html',
  styleUrls: ['./requestplanner.component.scss']
})
export class RequestplannerComponent implements OnInit {

  collectionRequestId = '';
  formRequest: any = {
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
    transporterId: 0
  }
  listsrequest: any[] = [];
  requestId: string = '';
  action: any = {
    icon:'',
    name:'',
    value:'',
    color:''
  };
  lists: any = {
    listTruckType: [],
    listTransporters: [],
  }

  constructor(private _router: Router, private api: ApiService, private _toast: ToastService, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.getRequests();
    this.getList('TIPO_CAMION', 'listTruckType');
    this.getTransporters();

    this.auth.user$.subscribe((user: any) => {
      if (user && user.sub) {
        const userId = user.sub;
        console.log('User ID:', userId);
        // Aquí puedes realizar cualquier otra operación con el ID del usuario
      }
    });
  }

  getRequests(){
    this.api.get(`collection-request?status=1`).subscribe({
      next: (response: any) => {
        this.listsrequest = response.data.items;//.filter((x: any)=> x.requestStatusId === 1);
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

  getTransporters(){
    this.api.get(`transporters`).subscribe({
      next: (response: any) => {
        this.lists['listTransporters'] = response.data.items;
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
    this.collectionRequestId = item.id;
    $("#turnCalling").modal({backdrop: 'static', keyboard: false});
  }

  confirmRequest(){
    this.action.name = 'Confirmar';
    this.action.value = 'confirm';
    this.action.color = '#698e47';
    this.action.icon = 'fa-solid fa-check';
    $("#modalconfirm").modal({backdrop: 'static', keyboard: false, opacity:false});
  }

  actionConfirm(action: string){
    switch (action) {
      case 'confirm':
        this.save();
      break;
      case 'reject':
        this.reject();
      break;
      default:
        break;
    }
  }

  save(){
    const data = {
      ...this.formRequest
    };
    this.api.post(`collection-request/${this.collectionRequestId}/routes`, data).subscribe({
      next: (response: any) => {
        this.getRequests();
        this._toast.success('Completado','Ruta registrada exitosamente')
        $("#modalplaner").modal("hide");
      },
    });
  }

  reject(){
    this.api.post(`collection-request/${this.collectionRequestId}/reject`, {}).subscribe({
      next: (response: any) => {
        this.getRequests();
        this._toast.success('Completado','solicitud rechazada correctamente')
        $("#modalplaner").modal("hide");
      },
    });
  }
}
