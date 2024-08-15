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
    Name: '',
    Description: '',
    BusinessName: '',
    DocumentTypeId: '',
    CountryId: '',
    DocumentNumber: '',
    ReferenceWLL: '',
    ReferencePH: '',
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
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#clientModal').modal({backdrop: 'static', keyboard: false});
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.client = {
        id: item.id,
        Name: item.name,
        Description: item.description,
        BusinessName: item.businessName,
        DocumentTypeId: item.documentTypeId,
        CountryId: item.countryId,
        DocumentNumber: item.documentNumber,
        ReferenceWLL: item.referenceWLL,
        ReferencePH: item.referencePH,
      };
  }
}

  showCreateUserForm() {
    this.showForm = true;
  }

  resetUser(): void {
    this.client = {
      id: null,
      Name: '',
      Description: '',
      BusinessName: '',
      DocumentTypeId: '',
      CountryId: '',
      DocumentNumber: '',
      ReferenceWLL: '',
      ReferencePH: '',
    };
  }

  close() {
    $('#clientModal').modal('hide');
  }

  saveClient(): void {
    console.log(this.client);

    // Verifica que los campos no estén vacíos
    if (this.client.id === null) {
      // Llamada al servicio para crear un nuevo cliente
      this._Service
        .createClient({
          name: this.client.Name,
          description: this.client.Description,
          businessName: this.client.BusinessName,
          documentTypeId: this.client.DocumentTypeId,
          countryId: this.client.CountryId,
          documentNumber: this.client.DocumentNumber,
          referenceWLL: this.client.ReferenceWLL,
          referencePH: this.client.ReferencePH,
        })
        .subscribe({
          next: (response) => {
            console.log(response);
            this.selectData();
            this.close();
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
          },
        });
    } else if (this.client.id !== null) {
      // Llamada al servicio para actualizar un cliente existente
      this._Service
        .updateClient(this.client.id, {
          name: this.client.Name,
          businessName: this.client.Description,
          description: this.client.BusinessName,
          documentTypeId: this.client.DocumentTypeId,
          countryId: this.client.CountryId,
          documentNumber: this.client.DocumentNumber,
          referenceWLL: this.client.ReferenceWLL,
          referencePH: this.client.ReferencePH,
        })
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.selectData();
            this.close();
          },
          error: (error: any) => {
            console.error('Error al actualizar cliente:', error);
          },
        });
    }
  }


  changeProductStatus(item: any) {
    console.log(item);
    this._Service.changeClientStatus(item.id).subscribe((x) => {
      console.log(x);
      this.selectData();
    });
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
