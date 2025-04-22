import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
import * as XLSX from 'xlsx'
declare var bootstrap: any;
@Component({
  selector: 'app-conciliation',
  templateUrl: './conciliation.component.html',
  styleUrls: ['./conciliation.component.css'],
})
export class ConciliationComponent implements OnInit {
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  currentPage: number = 1; // Página actual
  currentPage2: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  itemsPerPage2: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  totalPages2: number = 0; // Total de páginas
  totalItems = 0;
  totalItems2 = 0;
  paginatedList: any = [];
  listBase: any[] = [];
  listBase2: any[] = [];
  searchTerm$ = new Subject<any>();
  modal: any;
  modalConfirm: any;
  listReceptions: any[] = [];
  listTypeProduct: any[] = [];
  listReceptions2: any[] = [];
  selectedItems: any[] = [];
  isDownloading: boolean = false;
  audit: any = {};
  images: any[] = [];
  listProducts: any[] = [];
  viewdata = true;
  selectedOption: string = ''; // Para capturar la opción seleccionada (R o T)
  comment: string = '';
  sizeModal: string = 'modal-xl';
  viewcard: string = 'P';
  productForm: any = {
    productId: '',
    quantity: null,
    clientName:'',
    plate:'',
    isAgency:'',
    guideId:''
  };
  productForm2 = {
    typeproduct: '',
    name: '',
    productId: '',
    quantity: '',
  }
  temporyProduct:any = {};
  statusList: any = [
    'Sin Guia',
    'Transito',
    'Por Conciliar',
    'Todos',
  ];
  typesReason: any = {
    'R': "Recuperadora",
    'T': 'Transportadora',
    'B': 'Ambos',
    'N': 'Ninguno'
  }
  status: string = 'Todos';
  datefilter = '';
  constructor(private api: ApiService, private _toast: ToastService, private _settings: SettingsService) {}

  ngOnInit() {
    this.modal = new bootstrap.Modal(document.getElementById('modaldetail'), {
      backdrop: 'static',
      keyboard: false,
    });
    this.modalConfirm = new bootstrap.Modal(
      document.getElementById('modalConfirm'),
      { backdrop: 'static', keyboard: false }
    );
    this.getConciliations(this.currentPage);
    this.getConciliationsComplete(this.currentPage2)
    this.datefilter = this.getCurrentDate();
    this.getProducts();
    this.getTypeProducts();
  }

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      if(this.viewcard === 'P'){
        this.listReceptions = this.listBase.filter((item) => {
          const itemValues = Object.values(item);
          return itemValues.some((item) =>
            String(item).toLowerCase().includes(value.toLowerCase())
          );
        });
      } else {
        this.listReceptions2 = this.listBase2.filter((item) => {
          const itemValues = Object.values(item);
          return itemValues.some((item) =>
            String(item).toLowerCase().includes(value.toLowerCase())
          );
        });
      }
    });
  }

  filterstatus(): void {
    if (this.status.toLowerCase() === 'todos') {
      // Si la opción es "Todos", devuelve la lista completa sin filtrar
      this.listReceptions = this.listBase;
    } else {
      this.listReceptions = this.listBase.filter((item: any) => {
        // Verifica si el estado coincide con el valor buscado
        return (
          item.status.toLowerCase() === this.status.toLowerCase()
        );
      });
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getConciliations(item: any) {
    this.api.get(`audit-route/sync-pending?page=${item}`).subscribe({
      next: (response: any) => {
        this.listReceptions = response.data.sort(
          (a: any, b: any) => b.id - a.id
        );
        this.listBase = this.listReceptions; // Guardamos la lista original para filtrar
        this.totalItems = this.listReceptions.length; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de página
        this.search();

      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  getConciliationsComplete(item: any) {
    this.api.get(`audit-route?page=${item}`).subscribe({
      next: (response: any) => {
        this.listReceptions2 = response.data.sort(
          (a: any, b: any) => b.id - a.id
        );
        this.listBase2 = this.listReceptions2; // Guardamos la lista original para filtrar
        this.totalItems2 = this.listReceptions2.length; // Total de solicitudes
        this.totalPages2 = Math.ceil(this.totalItems2 / this.itemsPerPage2); // Total de página
        this.search();

      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  getProducts(){
    this.api.get(`products`).subscribe({
      next: (response: any) => {
        this.listProducts = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al listar productos:', error);
      },
    });
  }

  getTypeProducts(){
    this._settings.getCatalogChildrenByKey('TIPO_PRODUCTO').subscribe({
      next: (typeProductResponse: any) => {
        this.listTypeProduct = typeProductResponse.data;
      },
      error: (error: any) => {
        console.error('Error al obtener tipo de producto:', error);
      },
    });
  }

  viewDetail(item: any) {
    this.api.get(`audit-route/detail?routeId=${item.routeId}&transporterId=${item.transporter?.id }`).subscribe({
      next: (response: any) => {
        this.audit = response.data;
        let valid = 0;
        if(this.audit.products.length === 0){
          this.audit.reception.receptionDetails.forEach((e:any, i: number) => {
            this.selectedItems.push({id: null, productId: e.product.id, name: e.product.name, quantity: e.quantity, typeproduct: e.product?.productTypeId?.id})
          });
        } else {

        }
        this.audit.products.forEach((element: any) => {
            this.selectedItems.push(element)
        });
        if(valid === 0){
        }
        this.sizeModal = 'modal-xl';
        this.modal.show();
      },
      error: (error: any) => {
        console.error('Error al buscar detalle:', error);
      },
    });
  }

  homogenizeStructure = (item: any): any => {
    return {
      name: item.guideNumber
        ? item.collectionSite.name
        : item.transporterTravel.siteName, // Homologa `title` y `nombre` a `name`
      id: item.guideNumber ? item.id : item.auditGuideId, // Homologa `id` y `identificador` a `id`
      isAgency: item.guideNumber ? 'SI' : 'NO',
      type: item.guideNumber ? 'ENTREGA' : item.transporterTravel.type,
      date: item.guideNumber
        ? item.createdAt
        : item.transporterTravel.movementDate,
      quantity: item.guideNumber
        ? this.countProducts(item.shipmentDetails)
        : item.transporterTravel.totalQuantity,
      images: item.guideNumber
        ? item.shipmentPhotos.map((e: any) => {
            return e.url;
          })
        : item.transporterTravel.supportUrls,
      // Agregar más propiedades según sea necesario
    };
  };

  viewFiles(images: any) {
    this.viewdata = false;
    this.images = images;
  }

  countProducts(products: any): any {
    return products.reduce(
      (acc: any, item: any) => (acc += parseInt(item.quantity)),
      0
    );
  }

  async downloadExcelStructure(){
    setTimeout(() => {
      this.isDownloading = true;
      // Definir las columnas que se exportarán y sus nombres homologados
    const columns = [
      { key: 'guideNumber', header: 'Guia' },
      { key: 'date', header: 'Fecha' },
      { key: 'zoneName', header: 'Zona' },
      { key: 'recuperatorName', header: 'Recuperadora' },
      { key: 'transporterName', header: 'Transportadora' },
      { key: 'statusName', header: 'Estado' },
    ];
    const array = this.listBase.map((x: any)=> ({
      guideNumber: x.guideNumber,
      date: x.date,
      zoneName: x.zone?.name,
      recuperatorName: x.recuperator?.name,
      transporterName: x.transporter?.name,
      statusName: x.requestStatus?.name,
    }))
    // Llamar a la función de exportación
     this.exportToExcel(array , columns, 'Conciliaciones_'+new Date().getTime());
     this.isDownloading = false;

    }, 1000);
  }

  // Función para exportar a Excel
  async exportToExcel(data: any[], columns: { key: string; header: string }[], fileName: string) {
    // Mapear los datos para incluir solo las columnas seleccionadas
    const mappedData = data.map((item) => {
      const newItem: any = {};
      columns.forEach((col) => {
        newItem[col.header] = item[col.key];
      });
      return newItem;
    });

    // Crear una hoja de trabajo de Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);

    // Crear un libro de trabajo y agregar la hoja de trabajo
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    // Convertir el libro de trabajo a un archivo binario de Excel
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Descargar el archivo
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  // Función para guardar el archivo Excel
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  setColorStatus(status: any) {
    let color = '';
    switch (status) {
      case 'SIN GUIA': //sin guia
        color = 'bg-danger';
        break;
      case 'POR CONCILIAR': //pendiente
        color = 'bg-warning';
        break;
      case 'CONFIRMADA': //confirmado
        color = 'bg-success';
        break;
      case 'EN TRANSITO': //confirmado
        color = 'bg-info';
        break;
      default:
        break;
    }
    return color;
  }

  openAddGuide(action: string, item: any){
    if(action === 'new'){
      this.productForm.clientName = item.beteryName;
      this.productForm.plate = item.plate
      this.productForm.isAgency = item.isAgency?'SI':'NO';
      this.productForm.guideId = item.guideId;
      this.productForm.quantity = null;
      this.productForm.productId = '';
      this.temporyProduct  = {
        ...item,
        batteryType: '',
        productId: '',
        isNew: true,
        quantity: 0,
        quantityConciliated: null,
        id: null,
      };
    } else {
      this.temporyProduct  = {
        ...item,
      };
      this.productForm.quantity = item.quantityConciliated
      this.productForm.productId = item.productId;
    }
    this.sizeModal = 'modal-lg';
  }

  addGuide(){
    this.audit.transporterTravel.push({
      ...this.temporyProduct,
      batteryType: this.listProducts.find((x:any)=>x.id === this.productForm.productId)?.name,
      productId: this.productForm.productId,
      isNew: true,
      idguid : new Date().getTime(),
      quantityConciliated: this.productForm.quantity,
    });
    this.sizeModal = 'modal-xl';
  }

  removeGuide(item: any){
    this.audit.transporterTravel = this.audit.transporterTravel.filter((x: any)=> x.idguid !== item.idguid);
  }

  cancelOpenGuide(){
    this.sizeModal = 'modal-xl';
    this.temporyProduct = {};
  }

  viewFilesRecuperator(item: any[]){
    this.sizeModal = 'modal-md';

  }

  addProducts(){
    const productId = this.productForm2.productId;
    const yaExiste = this.selectedItems.some((item: any) => item.product === productId);
    if (yaExiste) {
      this._toast.info('Información', 'El producto ya está agregado');
      return;
    }

    const selectedProduct = this.listProducts.find((x: any) => x.id === productId);
    const productName = selectedProduct?.name?.trim();

    const x = { ...this.productForm2, name: productName };
    this.selectedItems.push(x);
  }

  removeItemProduct(item: any){
    this.selectedItems = this.selectedItems.filter((x: any)=> x.product !== item.product)
  }

  saveConfirmConciliation(isSave: boolean){
    const data = {
      recuperatorTotal: this.audit.recuperatorTotal,
      transporterTotal: this.audit.transporterTotal,
      conciliationTotal: this.audit.conciliationTotal,
      routeId: this.audit.routeId,
      transporterId: this.audit.transporter.id,
      products: this.selectedItems,
      transporter: this.audit.transporterTravel.map((x: any)=> ({
        isNew: x.isNew ? true : false,
        guideNumber: x.guideId,
        productName: x.batteryType,
        quantity: x.quantityConciliated,
        id: x.id,
      })),
      isSave
    };
    this.api.post(`audit-route/save`, data).subscribe({
      next: (response: any) => {
        if(isSave){
            this._toast.success('Completado', 'Conciliación guardada con exito.')
        } else {
            this._toast.success('Completado', 'Conciliación confirmada con exito')
        }
        this.getConciliations(this.currentPage);
        this.modal.hide();
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  // paginación
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listReceptions.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
      this.getConciliations(page);
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
}
