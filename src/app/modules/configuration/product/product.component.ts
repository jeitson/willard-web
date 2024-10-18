import { Component } from '@angular/core';
import { ProductsService } from 'src/app/core/services/process/products.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
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
  currentPage = 1;
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
  listProduct: any = [];
  Measure:any = [];
  modal: any;
  modalConfirm: any;
  constructor(private _Service: ProductsService, private _settings: SettingsService) {}

  ngOnInit(): void {
    this.modal = new bootstrap.Modal(document.getElementById('modalproduct'), {backdrop: 'static', keyboard: false})
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalconfirm'), {backdrop: 'static', keyboard: false})
    this.selectData();
  }
  selectData(): void {
    // Obtener productos
    this._Service.getProducts().subscribe({
      next: (productsResponse: any) => {
        this.listData = productsResponse.data.items;

        // Obtener tipo de producto
        this._settings.getCatalogChildrenByKey('TIPO_PRODUCTO').subscribe({
          next: (typeProductResponse: any) => {
            this.listProduct = typeProductResponse.data;

            // Obtener medidas
            this._settings.getCatalogChildrenByKey('UNIDAD_MEDIDA').subscribe({
              next: (medidasResponse: any) => {
                this.Measure = medidasResponse.data;
              },
              error: (error: any) => {
                console.error('Error al obtener medidas:', error);
              },
            });
          },
          error: (error: any) => {
            console.error('Error al obtener tipo de producto:', error);
          },
        });
      },
      error: (error: any) => {
        console.error('Error al obtener productos:', error);
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
    this._Service.createProduct(this.getProductPayload()).subscribe({
      next: (response: any) => this.handleSuccess(response),
      error: (error: any) =>
        console.error('Error al crear el registro:', error),
    });
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
    this.selectData();
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
        this.selectData();
        this.modalConfirm.hide();
      }, error: ()=>{

      }
    });
  }

  delete(){
    this._Service.deleteProduct(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        this.modalConfirm.hide();
      }, error: ()=>{

      }
    });
  }

}
