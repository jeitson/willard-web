import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ToastService } from 'src/app/core/services/toast.service';
declare var bootstrap: any;

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
    transporter: {
      collectionRequestId:'',
      name: '',
      description: '',
      email: '',
      document: ''
    }
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
  collectionRequestData: any = '';
  modal: any;

  searchTerm$ = new Subject<any>();

  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  filteredList: any[] = []; // La lista filtrada
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  paginatedList: any = [];
  listCopy: any[] = [];
  constructor(private _router: Router, private api: ApiService, private _toast: ToastService, private auth: AuthService) {

  }

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalplaner'), {backdrop: 'static', keyboard: false})
    this.getRequests(this.currentPage);
    this.getList('TIPO_CAMION', 'listTruckType');
    this.getTransporters();

    this.auth.user$.subscribe((user: any) => {
      if (user && user.sub) {
        const userId = user.sub;
        // Aquí puedes realizar cualquier otra operación con el ID del usuario
      }
    });
  }

  getRequests(page: any){
    this.api.get(`collection-request?page=${page}`).subscribe({
      next: (response: any) => {
        this.listsrequest = response.data.items;//.filter((x: any)=> x.requestStatusId === 1);
        this.listCopy = this.listsrequest; // Hacemos una copia de la lista original
        this.totalItems = this.listsrequest.length; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de páginas
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
        console.error('Error:', error);
      },
    });
  }

  getTransporters(){
    this.api.get(`transporters`).subscribe({
      next: (response: any) => {
        this.lists['listTransporters'] = response.data.items;
      },
      error: (error: any) => {
        console.error('Error:', error);
      },
    });
  }

  viewDetail(item: any) {
    this._router.navigateByUrl(`main/requestplanner/${item.id}`);
  }

  editRequest(item: any){
    this.clearData();
    this.collectionRequestId = item.id;
    this.collectionRequestData = JSON.stringify(item);
    this.modal.show();
  }

  confirmRequest(){
    this.action.name = 'Confirmar';
    this.action.value = 'confirm';
    this.action.color = '#698e47';
    this.action.icon = 'fa-solid fa-check';
    //$("#modalconfirm").modal({backdrop: 'static', keyboard: false, opacity:false});
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
        this.getRequests(this.currentPage);
        this._toast.success('Completado','Ruta registrada exitosamente')
        this.modal.hide();
      },
    });
  }

  reject(){
    this.api.post(`collection-request/${this.collectionRequestId}/reject`, {}).subscribe({
      next: (response: any) => {
        this.getRequests(this.currentPage);
        this._toast.success('Completado','solicitud rechazada correctamente');
        this.modal.hide();
      },
    });
  }

  clearData(){
    this.formRequest = {
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
      transporter: {
        collectionRequestId:'',
        name: '',
        description: '',
        email: '',
        cellphone:'',
        document: ''
      }
    }
  }

  // paginación
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listsrequest.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
      this.getRequests(page);
    }
  }

  onPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPage = Number(selectElement.value);
    this.goToPage(selectedPage);
  }

  get pagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  onSearchChange(value: string): void {
    if (!value) {
      this.listsrequest = [...this.listCopy]; // Restablecer la lista original si no hay búsqueda
    } else {
      this.listsrequest = this.listCopy.filter((item: any) => {
        const itemValues: any = Object.values(item);
        return itemValues.some((val: string) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        );
      });
    }
    this.currentPage = 1; // Reinicia a la primera página
    this.updatePaginatedList(); // Actualiza la lista paginada después del filtrado
  }
}
