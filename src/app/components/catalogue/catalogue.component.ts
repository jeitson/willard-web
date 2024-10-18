import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api/api.service';
declare var $: any;

declare var bootstrap: any;

@Component({
  selector: 'wlrd-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {

  @Input() key:string = '';
  @Input() parent:string = '';
  @Input() keyspanish:string = '';
  @Input() parentspanish:string = '';
  @Input() keypluralspanish: string = '';
  @Input() rol:string = '';

  p:number = 1;
  totalItemsRender: number = 10;
  pagination: any = {};
  filtertext:string = '';
  itemId:string = '';
  viewoptions:boolean = true;
  list:any[] = [];
  listBase:any[] = [];
  listParentRes:any[] = [];
  action: any = {
    icon:'',
    name:'',
    value:'',
    color:''
  };

  item:any = {
    catalogCode: this.key,
    parentId: this.parent,
    name: '',
    description: '',
    order: '',
    Extra1: '',
    Extra2: '',
    Extra3: '',
    Extra4: '',
    Extra5: '',
  }
  idparent:string = '';
  activeselect:boolean = true;
  modal: any;
  modalConfirm: any;
  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private router: Router){

  }

  ngOnInit(): void {
  }

  listKey(){
    this.api.get(`catalogs/key/${this.key}`).subscribe({
      next: (response: any) => {
        this.list = response.data;
        this.listBase = this.list;
        this.pagination.totalItems = response.data.length;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  listParent(){
    this.api.get(`catalogs/key/${this.parent}`).subscribe({
      next: (response: any) => {
        this.listParentRes = response.data;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  addItem(){
    this.item = {
      catalogCode: this.key,
      name: "",
      description: "",
      parentId: this.parent === 'null' ? null : this.parent,
      order: '',
      Extra1: '',
      Extra2: '',
      Extra3: '',
      Extra4: '',
      Extra5: '',
    }
    this.viewoptions = true;
    this.action.name = 'Crear';
    this.modal = new bootstrap.Modal(document.getElementById('modallist'), {backdrop: 'static', keyboard: false});
    this.listKey();
    if(this.parent !== 'null'){
      this.listParent();
    }
    this.modal.show();
  }

  backToList(){
    this.listKey();
  }

  editItem(info:any){
    this.item = {
      ...info
    }
    this.viewoptions = false;
    this.action.name = 'Actualizar';
    this.modal = new bootstrap.Modal(document.getElementById('modallist'), {backdrop: 'static', keyboard: false});
    this.modal.show();
    this.cdr.detectChanges();
  }

  removeItem(id:string){
    this.itemId = id;
    this.action.name = 'Eliminar';
    this.action.value = 'delete';
    this.action.color = '#dc3545';
    this.action.icon = 'fa-solid fa-trash';
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalconfirm'), {backdrop: 'static', keyboard: false});
    this.modalConfirm.show();
  }

  editState(id:string){
    this.itemId = id;
    this.action.name = 'Modificar Estado';
    this.action.value = 'changestatus';
    this.action.color = '#ffc107';
    this.action.icon = 'fa-solid fa-sync';
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalconfirm'), {backdrop: 'static', keyboard: false});
    this.modalConfirm.show();
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

  save(){
    const data = {
      ...this.item
    };
    this.api.post(`catalogs`, data).subscribe({
      next: (response: any) => {
        this.listKey();
        this.modal.hide();
      },
      error: (error: any) => {
        console.error('Error al crear catalogo:', error);
      },
    });
  }

  update(){
    const data = {
      ...this.item
    };
    this.api.put(`catalogs/${this.item.id}`, data).subscribe({
      next: (response: any) => {
        this.listKey();
        this.modal.hide();
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  changeStatus(){
    const data = {
      ...this.item
    };
    this.api.put(`catalogs/${this.itemId}/change-status`, data).subscribe({
      next: (response: any) => {
        this.listKey();
        this.modalConfirm.hide();
      },
      error: (error: any) => {
        console.error('Error al modificar el estado:', error);
        this.modalConfirm.hide();
      },
    });
  }

  delete(){
    this.api.delete(`catalogs/${this.itemId}`).subscribe({
      next: (response: any) => {
        this.listKey();
        this.modalConfirm.hide();
      },
      error: (error: any) => {
        console.error('Error al eliminar catalogo:', error);
      },
    });
  }
}
