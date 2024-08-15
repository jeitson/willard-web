import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProductsService } from 'src/app/core/services/process/products.service';
declare var $: any;
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
    tipoProductoId: null,
    unidadMedidaId: null,
    nombre: '',
    kgPromedio: null,
    porcentajeRecuperacion: null,
    esCertificable: false,
    referencia1: '',
    referencia2: '',
    referencia3: '',
    descripcion: '',
    referenciaWLL: '',
    referenciaPH: '',
  };

  listData: any = [];

  constructor(private _Service: ProductsService) {}

  ngOnInit(): void {
    this.selectData();
  }

  selectData(): void {
    forkJoin({
      products: this._Service.getProducts(),
    }).subscribe({
      next: (data: any) => {
        this.listData = data.products.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  createOrUpdateproduct(item: any | null): void {
    this.resetUser();
    this.action.name = 'Crear';
    this.viewoptions = true;
    $('#modalproduct').modal({backdrop: 'static', keyboard: false});
    if (item != null) {
      this.action.name = 'Actualizar';
      this.viewoptions = false;
      this.product = {
        id: item.id,
        tipoProductoId: item.productTypeId,
        unidadMedidaId: item.unitMeasureId,
        nombre: item.name,
        kgPromedio: item.averageKg,
        porcentajeRecuperacion: item.recoveryPercentage,
        esCertificable: item.isCertifiable,
        referencia1: item.reference1,
        referencia2: item.reference2,
        referencia3: item.reference3,
        descripcion: item.description,
        referenciaWLL: item.referenceWLL,
        referenciaPH: item.referencePH,
      };

    }
  }


  resetUser(): void {
    this.product = {
      id: null,
      tipoProductoId: null,
      unidadMedidaId: null,
      nombre: '',
      kgPromedio: null,
      porcentajeRecuperacion: null,
      esCertificable: false,
      referencia1: '',
      referencia2: '',
      referencia3: '',
      descripcion: '',
      referenciaWLL: '',
      referenciaPH: '',
    };
  }

  close() {
    $('#modalproduct').modal('hide');
  }

  saveProduct(): void {
    console.log(this.product);

    // Verifica que los campos no estén vacíos
    if (this.product.id === null) {
      // Llamada al servicio para crear un nuevo producto
      this._Service
        .createProduct({
          productTypeId: this.product.tipoProductoId,
          unitMeasureId: this.product.unidadMedidaId,
          name: this.product.nombre,
          averageKg: this.product.kgPromedio,
          recoveryPercentage: this.product.porcentajeRecuperacion,
          isCertifiable: this.product.esCertificable,
          reference1: this.product.referencia1,
          reference2: this.product.referencia2,
          reference3: this.product.referencia3,
          description: this.product.descripcion,
          referenceWLL: this.product.referenciaWLL,
          referencePH: this.product.referenciaPH,
        })
        .subscribe({
          next: (response) => {
            console.log(response);
            this.selectData();
            this.close();
          },
          error: (error) => {
            console.error('Error al crear producto:', error);
          },
        });
    } else if (this.product.id !== null) {
      // Llamada al servicio para actualizar un producto existente
      this._Service
        .updateProduct(this.product.id, {
          productTypeId: this.product.tipoProductoId,
          unitMeasureId: this.product.unidadMedidaId,
          name: this.product.nombre,
          averageKg: this.product.kgPromedio,
          recoveryPercentage: this.product.porcentajeRecuperacion,
          isCertifiable: this.product.esCertificable,
          reference1: this.product.referencia1,
          reference2: this.product.referencia2,
          reference3: this.product.referencia3,
          description: this.product.descripcion,
          referenceWLL: this.product.referenciaWLL,
          referencePH: this.product.referenciaPH,
        })
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.selectData();
            this.close();
          },
          error: (error: any) => {
            console.error('Error al actualizar producto:', error);
          },
        });
    }
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
    this._Service.changeProductStatus(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        $("#modalconfirm").modal("hide");
      }, error: ()=>{

      }
    });
  }

  delete(){
    this._Service.deleteProduct(this.itemId).subscribe({
      next: ()=>{
        this.selectData();
        $("#modalconfirm").modal("hide");
      }, error: ()=>{

      }
    });
  }

}
