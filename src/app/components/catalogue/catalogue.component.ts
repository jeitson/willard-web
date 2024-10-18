import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
declare var $: any;

declare var bootstrap: any;

@Component({
  selector: 'wlrd-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit, OnChanges, AfterViewInit {

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

   // Inicializar labelsValidation para rastrear qué campos son inválidos
   labelsValidation: any = {
    name: false,
    observations: false,
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
  totalItems = 0;
  paginatedList: any = [];
  idparent:string = '';
  activeselect:boolean = true;
  modal: any;
  modalConfirm: any;
  searchTerm$ = new Subject<any>();

  searchTerm: string = ''; // Para almacenar el texto de búsqueda


  currentPage: number = 1; // Página actual
itemsPerPage: number = 5; // Cantidad de elementos por página
totalPages: number = 0; // Total de páginas



  constructor(private api: ApiService, private cdr: ChangeDetectorRef, private router: Router){

  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['key'] || changes['parent']) {
      this.updateModalContent();
    }
  }

  ngOnDestroy(): void {
    // Limpia los valores al destruir el componente
    this.key = '';
    this.parent = '';
    this.keyspanish = '';
    this.parentspanish = '';
    this.keypluralspanish = '';
    this.rol = '';
  }
  
  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modallist'), {backdrop: 'static', keyboard: false})
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalconfirm'), {backdrop: 'static', keyboard: false})
    this.listKey();
    if(this.parent !== 'null'){
      this.listParent();
    }
  }

  updateModalContent() {
    // Asegúrate de que el contenido del modal se actualice antes de mostrarlo
    this.cdr.detectChanges(); // Asegúrate de que Angular detecte los cambios
  }

  listKey() {
    this.api.get(`catalogs/key/${this.key}`).subscribe({
      next: (response: any) => {
        this.list = response.data;
        this.listBase = this.list; // Guardamos la lista original para filtrar
        this.pagination.totalItems = response.data.length;
        this.updatePaginatedList(); // Actualiza la lista paginada
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
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
    this.updateModalContent();
    setTimeout(() => {
      this.modal.show();
    }, 1000);
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
    this.modal.show();
    this.cdr.detectChanges();
  }

  removeItem(id:string){
    this.itemId = id;
    this.action.name = 'Eliminar';
    this.action.value = 'delete';
    this.action.color = '#dc3545';
    this.action.icon = 'fa-solid fa-trash';
    this.modalConfirm.show();
  }

  editState(id:string){
    this.itemId = id;
    this.action.name = 'Modificar Estado';
    this.action.value = 'changestatus';
    this.action.color = '#ffc107';
    this.action.icon = 'fa-solid fa-sync';
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

    // Función para validar que no hay campos vacíos
    validateFields(): boolean {
      // Reiniciar las validaciones
      Object.keys(this.labelsValidation).forEach(key => this.labelsValidation[key] = false);
  
      let allFieldsValid = true;
  
      // Validar los campos generales, excluyendo motiveSpecialId y transporterId
      for (const [key, value] of Object.entries(this.item)) {
        if ((key === 'name' && !value) ||
            (key === 'description'  && !value)) {
          this.labelsValidation[key] = true; // Marcar como inválido
          allFieldsValid = false;
        }
      }

  
      return allFieldsValid;
    }


    // paginación
    onPageChange(event: Event) {
      const selectElement = event.target as HTMLSelectElement;
      const selectedPage = Number(selectElement.value);
      this.goToPage(selectedPage);
    }
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.updatePaginatedList();
      }
    }
    get pagesArray() {
      return Array(this.totalPages)
        .fill(0)
        .map((x, i) => i + 1);
    }
    
    updatePaginatedList() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedList = this.list.slice(startIndex, endIndex);
      this.totalPages = Math.ceil(this.list.length / this.itemsPerPage); // Calcula el total de páginas
    }
    

    onSearchChange(value: string): void {
      if (!value) {
        this.list = [...this.listBase]; // Restablecer la lista original si no hay búsqueda
      } else {
        this.list = this.listBase.filter((item: any) => {
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
