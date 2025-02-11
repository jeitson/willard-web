import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
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
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  totalItems = 0;
  paginatedList: any = [];
  listBase: any[] = [];
  searchTerm$ = new Subject<any>();
  modal: any;
  modalConfirm: any;
  listReceptions: any[] = [];
  isDownloading: boolean = false;
  audit: any = {};
  images: any[] = [];
  viewdata = true;
  selectedOption: string = ''; // Para capturar la opción seleccionada (R o T)
  comment: string = '';
  statusList: any = [
    'Sin Guia',
    'Transito',
    'Por Conciliar',
    'Confirmado',
    'Todos',
  ];
  status: string = 'Todos';
  datefilter = '';
  constructor(private api: ApiService, private _toast: ToastService) {}

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
    this.datefilter = this.getCurrentDate();
  }

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      this.listReceptions = this.listBase.filter((item) => {
        const itemValues = Object.values(item);
        return itemValues.some((item) =>
          String(item).toLowerCase().includes(value.toLowerCase())
        );
      });
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
          item.requestStatus.name.toLowerCase() === this.status.toLowerCase()
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
    this.api.get(`audit_guide?page=${item}`).subscribe({
      next: (response: any) => {
        this.listReceptions = response.data.items.sort(
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

  viewDetail(item: any[]) {
    this.modal.show();
    this.audit = item;

    const shipments = this.audit.shipments;
    const auditsGuidesRoutes = this.audit.auditsGuidesRoutes;
    const arr = [...shipments, ...auditsGuidesRoutes].map(
      this.homogenizeStructure
    );
    this.audit.routes = arr;
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

  syncGuide(item: any) {
    this.api.post(`audit_guide/synchronize/${item.id}`).subscribe({
      next: (response: any) => {
        this.getConciliations(this.currentPage);
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  setAnswer() {
    this.modal.hide();
    this.modalConfirm.show();
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
      case '101': //sin guia
        color = 'bg-danger';
        break;
      case '102': //pendiente
        color = 'bg-warning';
        break;
      case '103': //confirmado
        color = 'bg-success';
        break;
      case '104': //confirmado
        color = 'bg-info';
        break;
      default:
        break;
    }
    return color;
  }

  actionConfirm() {
    const data = {
      auditGuideDetails: [
        ...this.audit.auditGuideDetails?.transporter?.detail,
        ...this.audit.auditGuideDetails?.recuperator?.detail,
      ].filter((x:any)=> (x.hasOwnProperty('id') && x.id !== null) || (x.quantityCollection > 0))
      .map(({ id, quantityCollection, productId, type }) => ({ id, quantityCollection, productId, type })),
      giveReason: this.selectedOption || 'R', // Asigna la opción seleccionada
      comment: this.comment || '', // Asigna el comentario
    };

    this.api.post(`audit_guide/confirm/${this.audit.id}`, data).subscribe({
      next: (response: any) => {
        this.getConciliations(this.currentPage);
        this.modal.hide();
        this.modalConfirm.hide();
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
