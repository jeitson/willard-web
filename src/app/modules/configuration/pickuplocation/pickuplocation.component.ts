import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdviserService } from 'src/app/core/services/process/adviser.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
declare var $: any;

@Component({
  selector: 'wlrd-pickuplocation',
  templateUrl: './pickuplocation.component.html',
  styleUrls: ['./pickuplocation.component.scss']
})
export class PickuplocationComponent {
  switchSection: string = 'List';
  actionModal: string = '';
  viewoptions = true;
  action: any = {
    icon:'',
    name:'',
    value:'',
    color:''
  };
  itemId: string = '';
   lugar = {
    id: 0,
    tipoLugarId: 0,
    clienteId: 0,
    sedeAcopioId: 0,
    asesorId: 0,
    ciudadId: 0,
    zonaId: 0,
    nombre: '',
    descripcion: '',
    neighborhood: '',
    address: '',
    latitude: '',
    longitude: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    referenceWLL: '',
    referencePH: ''
  };
  listClientes: any = [];
  listAsesores: any = [];
  listTipos: any = [];
  listSedes: any = [];
  listCiudades: any = [];
  listZonas: any = [];
  listData: any = [];
  listProduct: any = [];
  Measure:any = [];
  constructor(private _Service:PickuplocationService, private _Customers:CustomersService, private _Adviser: AdviserService, private _Settings:SettingsService) {}

  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    forkJoin({
      list: this._Service.getPickUpLocations(),
      listClientes: this._Customers.getClients(),
      listAsesores: this._Adviser.getConsultants(),
      listTipos:  this._Settings.getCatalogChildrenByKey('TIPOS_LUGAR_RECOGIDA'),
      listSedes: this._Settings.getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO'), 
      listCiudades: this._Settings.getCatalogChildrenByKey('CIUDAD'), 
      listZonas: this._Settings.getCatalogChildrenByKey('ZONA'), 
    }).subscribe({
      next: (data: any) => {
        console.log('soyy',data);
        this.listData = data.list.data.items;
        this.listClientes = data.listClientes.data.items;
        this.listAsesores = data.listAsesores.data.items;
        this.listTipos = data.listTipos.data.items;
        this.listSedes = data.listSedes.data.items;
        this.listCiudades = data.listCiudades.data.items;
        this.listZonas = data.listZonas.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  createOrUpdatepickup(item: any | null): void {
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalPickup').modal({backdrop: 'static', keyboard: false});
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.lugar = {
        id: 0,
        tipoLugarId: 0,
        clienteId: 0,
        sedeAcopioId: 0,
        asesorId: 0,
        ciudadId: 0,
        zonaId: 0,
        nombre: '',
        descripcion: '',
        neighborhood: '',
        address: '',
        latitude: '',
        longitude: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        referenceWLL: '',
        referencePH: ''
      };

    }
  }


  resetUser(): void {
    this.lugar = {
      id: 0,
      tipoLugarId: 0,
      clienteId: 0,
      sedeAcopioId: 0,
      asesorId: 0,
      ciudadId: 0,
      zonaId: 0,
      nombre: '',
      descripcion: '',
      neighborhood: '',
      address: '',
      latitude: '',
      longitude: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      referenceWLL: '',
      referencePH: ''
    };
  }

  close() {
    $('#modalPickup').modal('hide');
  }


  updateLugar(): void {
    if (this.lugar.id) {
      this._Service
        .updatePickUpLocation(this.lugar.id, this.getLugarPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createLugar(): void {
    this._Service.createPickUpLocation(this.getLugarPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
  }

  getLugarPayload() {
    const {
      tipoLugarId,
      clienteId,
      sedeAcopioId,
      asesorId,
      ciudadId,
      zonaId,
      nombre,
      descripcion,
      neighborhood,
      address,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactPhone,
      referenceWLL,
      referencePH
    } = this.lugar;
  
    return {
      tipoLugarId,
      clienteId,
      sedeAcopioId,
      asesorId,
      ciudadId,
      zonaId,
      nombre,
      descripcion,
      neighborhood,
      address,
      latitude,
      longitude,
      contactName,
      contactEmail,
      contactPhone,
      referenceWLL,
      referencePH
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
    this._Service.changeConsultantStatus(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        $("#modalconfirm").modal("hide");
      }, error: ()=>{

      }
    });
  }

  delete(){
    this._Service.deletePickUpLocation(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        $("#modalconfirm").modal("hide");
      }, error: ()=>{

      }
    });
  }
}
