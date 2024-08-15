import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
declare var $: any;
@Component({
  selector: 'wlrd-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent {
  switchSection: string = 'List';
  actionModal: string = '';
  showForm = false;
  action: any = {
    icon:'',
    name:'',
    value:'',
    color:''
  };
  itemId: string = '';
  client: any = {
    id: null,
    name: '',
    description: '',
    businessName: '',
    documentTypeId: '',
    countryId: '',
    documentNumber: '',
    referenceWLL: '',
    referencePH: '',
  };


  listData: any = [];
  paisData: any = [];
  typeDocuments: any = [];
  viewoptions = true;
  constructor(
    private _Service: CustomersService,
    private _settings: SettingsService
  ) {}

  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    forkJoin({
      clientes: this._Service.getClients(),
      typeDocuments: this._settings.getCatalogChildrenByKey('TIPO_DOCUMENTO'),
      pais: this._settings.getCatalogChildrenByKey('PAIS'),
    }).subscribe({
      next: (data: any) => {
        this.listData = data.clientes.data.items;
        console.log(this.listData);
        this.typeDocuments = data.typeDocuments.data;
        this.paisData = data.pais.data;
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  createOrUpdateclient(item: any | null): void {
    console.log(item);
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#clientModal').modal({backdrop: 'static', keyboard: false});
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.client = {
        id: item.id,
        name: item.name,
        description: item.description,
        businessName: item.businessName,
        documentTypeId: item.documentTypeId,
        countryId: item.countryId,
        documentNumber: item.documentNumber,
        referenceWLL: item.referenceWLL,
        referencePH: item.referencePH,
      };
  }
}

  showCreateUserForm() {
    this.showForm = true;
  }

  resetUser(): void {
    this.client = {
      id: null,
      name: '',
      description: '',
      businessName: '',
      documentTypeId: '',
      countryId: '',
      documentNumber: '',
      referenceWLL: '',
      referencePH: '',
    };
  }

  close() {
    $('#clientModal').modal('hide');
  }


  updateClient(): void {
    if (this.client.id) {
      this._Service
        .updateClient(this.client.id, this.getClientPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createClient(): void {
    this._Service.createClient(this.getClientPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  getClientPayload() {
    const {
      name,
      description,
      businessName,
      documentTypeId,
      countryId,
      documentNumber,
      referenceWLL,
      referencePH,
    } = this.client;
  
    return {
      name,
      description,
      businessName,
      documentTypeId,
      countryId,
      documentNumber,
      referenceWLL,
      referencePH,
    };
  }

   handleSuccess(response: any): void {
    console.log(response);
    this.selectData();
    this.close();
  }


  removeItem(id:string){
    this.itemId = id;
    this.action.name = 'Eliminar';
    this.action.value = 'delete';
    this.action.color = '#dc3545';
    this.action.icon = 'fa-solid fa-trash';
    $("#modalconfirm").modal({backdrop: 'static', keyboard: false});
  }

  editState(id:string){
    this.itemId = id;
    this.action.name = 'Modificar Estado';
    this.action.value = 'changestatus';
    this.action.color = '#ffc107';
    this.action.icon = 'fa-solid fa-sync';
    $("#modalconfirm").modal({backdrop: 'static', keyboard: false});
  }

  actionConfirm(){
    switch (this.action.value) {
      case 'delete':
        this.delete();
      break;
      case 'changestatus':
        this.changeStatus();
      break;
      default:
        break;
    }
  }

  changeStatus(){
    this._Service.changeClientStatus(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        $("#modalconfirm").modal("hide");
      }, error: ()=>{

      }
    });
  }

  delete(){
    this._Service.deleteClient(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        $("#modalconfirm").modal("hide");
      }, error: ()=>{

      }
    });
  }

}
