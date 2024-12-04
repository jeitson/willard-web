import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductsService } from 'src/app/core/services/process/products.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
declare var bootstrap: any;
@Component({
  selector: 'wlrd-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent {
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
  product = {
    id: null,
    productTypeId: null,
    unitMeasureId: null,
    name: '',
    averageKg: null,
    recoveryPercentage: null,
    isCertifiable: false,
    reference1: '',
    reference2: '',
    reference3: '',
    description: '',
    referenceWLL: '',
    referencePH: '',
  };

  listData: any = [];
  listBase: any = [];
  listProduct: any = [];
  Measure:any = [];
  modal: any;
  modalConfirm: any;

  pagination: any = {};
  searchTerm$ = new Subject<any>();
  paginatedList: any = [];
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  constructor(private _Service: ProductsService, private _settings: SettingsService,  private _toast: ToastService) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalproduct'), {backdrop: 'static', keyboard: false})
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalconfirm'), {backdrop: 'static', keyboard: false})
  this.getProducts();
  }
  getProducts(): void {
    this._Service.getProducts().subscribe({
      next: (productsResponse: any) => {
        this.listData = productsResponse.data.items;
        this.listBase = this.listData; // Guardamos la lista original para filtrar
        this.pagination.totalItems = productsResponse.data.length;
        this.search();
        this.updatePaginatedList(); // Actualiza la lista paginada
  
        // Después de obtener productos, obtener tipos de producto
        this.getProductTypes();
        this.getMeasurements();
      },
      error: (error: any) => {
        console.error('Error al obtener productos:', error);
      },
    });
  }
  
  getProductTypes(): void {
    this._settings.getCatalogChildrenByKey('TIPO_PRODUCTO').subscribe({
      next: (typeProductResponse: any) => {
        this.listProduct = typeProductResponse.data;
  
        // Después de obtener tipos de producto, obtener medidas

      },
      error: (error: any) => {
        console.error('Error al obtener tipo de producto:', error);
      },
    });
  }
  
  getMeasurements(): void {
    this._settings.getCatalogChildrenByKey('UNIDAD_MEDIDA').subscribe({
      next: (medidasResponse: any) => {
        this.Measure = medidasResponse.data;
      },
      error: (error: any) => {
        console.error('Error al obtener medidas:', error);
      },
    });
  }

  createOrUpdateproduct(item: any | null): void {
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    //$('#modalproduct').modal({backdrop: 'static', keyboard: false});
    this.modal.show();
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.product = {
        id: item.id,
        productTypeId: item.productTypeId,
        unitMeasureId: item.unitMeasureId,
        name: item.name,
        averageKg: item.averageKg,
        recoveryPercentage: item.recoveryPercentage,
        isCertifiable: item.isCertifiable,
        reference1: item.reference1,
        reference2: item.reference2,
        reference3: item.reference3,
        description: item.description,
        referenceWLL: item.referenceWLL,
        referencePH: item.referencePH,
      };

    }
  }


  resetUser(): void {
    this.product = {
      id: null,
      productTypeId: null,
      unitMeasureId: null,
      name: '',
      averageKg: null,
      recoveryPercentage: null,
      isCertifiable: false,
      reference1: '',
      reference2: '',
      reference3: '',
      description: '',
      referenceWLL: '',
      referencePH: '',
    };
  }

  close() {
    //$('#modalproduct').modal('hide');
    this.modal.hide();
  }


  updateProduct(): void {
    if (this.product.id) {
      this._Service
        .updateProduct(this.product.id, this.getProductPayload())
        .subscribe({
          next: (response: any) => this.handleSuccess(response),
          error: (error: any) =>
            console.error('Error al actualizar el registro:', error),
        });
    }
  }

  createProduct(): void {
    if (this.areFieldsValid()) {
      this._Service.createProduct(this.getProductPayload()).subscribe({
        next: (response: any) => this.handleSuccess(response),
        error: (error: any) =>
          console.error('Error al crear el registro:', error),
      });
    }
  }
  private areFieldsValid(): boolean {
    const fields = [
      { value: this.product.productTypeId, message: 'El campo Tipo de Producto es obligatorio.' },
      { value: this.product.unitMeasureId, message: 'El campo Unidad de Medida es obligatorio.' },
      { value: this.product.name, message: 'El campo Nombre es obligatorio.' },
      { value: this.product.averageKg, message: 'El campo Promedio de Kilogramos es obligatorio.' },
      { value: this.product.recoveryPercentage, message: 'El campo Porcentaje de Recuperación es obligatorio.' },
      { value: this.product.reference1, message: 'El campo Referencia 1 es obligatorio.' },
      { value: this.product.reference2, message: 'El campo Referencia 2 es obligatorio.' },
      { value: this.product.reference3, message: 'El campo Referencia 3 es obligatorio.' },
      { value: this.product.description, message: 'El campo Descripción es obligatorio.' },
      { value: this.product.referenceWLL, message: 'El campo Referencia WLL es obligatorio.' },
      { value: this.product.referencePH, message: 'El campo Referencia PH es obligatorio.' },
    ];
  
    for (const field of fields) {
      if (!field.value) {
        this._toast.info('Importante',field.message);
        return false;
      }
    }
  
    return true;
  }
  

  getProductPayload() {
    const {
      id,
      productTypeId,
      unitMeasureId,
      name,
      averageKg,
      recoveryPercentage,
      isCertifiable,
      reference1,
      reference2,
      reference3,
      description,
      referenceWLL,
      referencePH,
    } = this.product;

    return {
      id,
      productTypeId,
      unitMeasureId,
      name,
      averageKg,
      recoveryPercentage,
      isCertifiable,
      reference1,
      reference2,
      reference3,
      description,
      referenceWLL,
      referencePH,
    };
  }

   handleSuccess(response: any): void {
    this.modal.hide();
    this.getProducts();
    this.close();
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

  changeStatus(){
    this._Service.changeProductStatus(this.itemId).subscribe({
      next: ()=>{
        this.getProducts();
        this.modalConfirm.hide();
      }, error: ()=>{

      }
    });
  }

  delete(){
    this._Service.deleteProduct(this.itemId).subscribe({
      next: ()=>{
        this.getProducts();
        this.modalConfirm.hide();
      }, error: ()=>{

      }
    });
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
    this.paginatedList = this.listData.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.listData.length / this.itemsPerPage); // Calcula el total de páginas
  }


  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      const searchTerm = value.toLowerCase();
      this.listData = this.listBase.filter((item: any) => {
        // Obtén todos los valores, incluyendo `productType.name`
        const itemValues = [...Object.values(item), item.productType?.name];
  
        // Verifica si alguno de los valores contiene el término de búsqueda
        return itemValues.some(val =>
          String(val).toLowerCase().includes(searchTerm),
        );
      });
    });
  }
  
}
