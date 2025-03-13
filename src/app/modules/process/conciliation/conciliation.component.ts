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
  typesReason: any = {
    'R': "Recuperadora",
    'T': 'Transportadora',
    'B': 'Ambos',
    'N': 'Ninguno'
  }
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

  typeReazon(type: string){
    return this.typesReason[type] || 'N';
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


  json: any = [
    {
        "CEDULA": "22589281",
        "COVID DOSIS 1": "6/25/2021",
        "COVID DOSIS 2": "8/22/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "2/17/2022",
        "COVID REFUERZO 2": "1/17/2023",
        "FIEBRE AMARILLA": "1/16/2025",
        "HEPATITIS B DOSIS 1": "1/23/2011",
        "HEPATITIS B DOSIS 2": "3/14/2011",
        "HEPATITIS B DOSIS 3": "5/20/2011",
        "INFLUENZA": "1/16/2025",
        "TETANO DOSIS 1": "",
        "TETANO DOSIS 2": "",
        "TETANO DOSIS 3": "",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "7/29/2010",
        "CURSO VIOLENCIA SEXUAL": "8/26/2023",
        "CURSO VITAL BASICO BLS": "8/26/2023",
        "GESTION DEL DUELO": "8/26/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "8/27/2023",
        "25_RETHUS": "6/19/2012"
    },
    {
        "CEDULA": "22647521",
        "COVID DOSIS 1": "8/13/2021",
        "COVID DOSIS 2": "4/9/21",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "2/2/22",
        "COVID REFUERZO 2": "12/8/22",
        "FIEBRE AMARILLA": "4/25/2019",
        "HEPATITIS B DOSIS 1": "5/27/2019",
        "HEPATITIS B DOSIS 2": "6/28/2019",
        "HEPATITIS B DOSIS 3": "7/28/2019",
        "INFLUENZA": "",
        "TETANO DOSIS 1": "6/24/2009",
        "TETANO DOSIS 2": "4/25/2020",
        "TETANO DOSIS 3": "7/28/2023",
        "TETANO DOSIS 4": "10/10/24",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "",
        "CURSO VITAL BASICO BLS": "8/22/2023",
        "GESTION DEL DUELO": "2/15/2024",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "",
        "25_RETHUS": "10/2/04"
    },
    {
        "CEDULA": "22704934",
        "COVID DOSIS 1": "6/30/2021",
        "COVID DOSIS 2": "7/21/2021",
        "COVID DOSIS 3": "11/15/2022",
        "COVID REFUERZO 1": "6/28/2023",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "5/30/2019",
        "HEPATITIS B DOSIS 1": "1/14/2017",
        "HEPATITIS B DOSIS 2": "3/16/2017",
        "HEPATITIS B DOSIS 3": "4/24/2017",
        "INFLUENZA": "5/27/2024",
        "TETANO DOSIS 1": "4/4/16",
        "TETANO DOSIS 2": "4/5/16",
        "TETANO DOSIS 3": "4/11/16",
        "TETANO DOSIS 4": "6/19/2017",
        "TETANO DOSIS 5": "9/27/2023",
        "CURSO VIOLENCIA SEXUAL": "",
        "CURSO VITAL BASICO BLS": "",
        "GESTION DEL DUELO": "",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "",
        "25_RETHUS": ""
    },
    {
        "CEDULA": "32647483",
        "COVID DOSIS 1": "11/6/21",
        "COVID DOSIS 2": "2/7/21",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "1/26/2022",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "",
        "HEPATITIS B DOSIS 1": "8/11/24",
        "HEPATITIS B DOSIS 2": "10/1/25",
        "HEPATITIS B DOSIS 3": "",
        "INFLUENZA": "11/15/2024",
        "TETANO DOSIS 1": "",
        "TETANO DOSIS 2": "",
        "TETANO DOSIS 3": "",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "10/30/2023",
        "CURSO VITAL BASICO BLS": "7/26/2023",
        "GESTION DEL DUELO": "7/24/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "6/22/2023",
        "25_RETHUS": "6/27/2005"
    },
    {
        "CEDULA": "32800765",
        "COVID DOSIS 1": "4/13/2021",
        "COVID DOSIS 2": "5/5/21",
        "COVID DOSIS 3": "6/16/2023",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "11/16/2023",
        "HEPATITIS B DOSIS 1": "8/11/24",
        "HEPATITIS B DOSIS 2": "9/12/24",
        "HEPATITIS B DOSIS 3": "",
        "INFLUENZA": "10/19/2024",
        "TETANO DOSIS 1": "8/3/06",
        "TETANO DOSIS 2": "2/22/2007",
        "TETANO DOSIS 3": "3/22/2007",
        "TETANO DOSIS 4": "11/6/11",
        "TETANO DOSIS 5": "10/19/2024",
        "CURSO VIOLENCIA SEXUAL": "5/31/2023",
        "CURSO VITAL BASICO BLS": "8/30/2023",
        "GESTION DEL DUELO": "8/30/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "6/28/2023",
        "25_RETHUS": "3/24/2024"
    },
    {
        "CEDULA": "55236102",
        "COVID DOSIS 1": "6/8/21",
        "COVID DOSIS 2": "6/11/21",
        "COVID DOSIS 3": "8/3/22",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "10/2/20",
        "HEPATITIS B DOSIS 1": "7/19/2022",
        "HEPATITIS B DOSIS 2": "8/11/24",
        "HEPATITIS B DOSIS 3": "",
        "INFLUENZA": "9/10/24",
        "TETANO DOSIS 1": "",
        "TETANO DOSIS 2": "",
        "TETANO DOSIS 3": "",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "10/2/20",
        "CURSO VIOLENCIA SEXUAL": "8/10/24",
        "CURSO VITAL BASICO BLS": "8/10/24",
        "GESTION DEL DUELO": "8/10/24",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "8/10/24",
        "25_RETHUS": "10/3/23"
    },
    {
        "CEDULA": "55237208",
        "COVID DOSIS 1": "5/25/2021",
        "COVID DOSIS 2": "6/15/2021",
        "COVID DOSIS 3": "5/25/2022",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "11/16/2017",
        "HEPATITIS B DOSIS 1": "8/11/24",
        "HEPATITIS B DOSIS 2": "10/24/2018",
        "HEPATITIS B DOSIS 3": "3/21/2018",
        "INFLUENZA": "11/18/2024",
        "TETANO DOSIS 1": "11/16/2017",
        "TETANO DOSIS 2": "12/16/2017",
        "TETANO DOSIS 3": "2/28/2023",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "1/30/2023",
        "CURSO VITAL BASICO BLS": "1/30/2023",
        "GESTION DEL DUELO": "11/11/23",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "11/23/2023",
        "25_RETHUS": "10/30/2020"
    },
    {
        "CEDULA": "1002135722",
        "COVID DOSIS 1": "1/21/2021",
        "COVID DOSIS 2": "11/24/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "3/5/22",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "3/19/2019",
        "HEPATITIS B DOSIS 1": "3/19/2019",
        "HEPATITIS B DOSIS 2": "7/5/19",
        "HEPATITIS B DOSIS 3": "6/13/2019",
        "INFLUENZA": "5/22/2024",
        "TETANO DOSIS 1": "3/19/2019",
        "TETANO DOSIS 2": "4/25/2019",
        "TETANO DOSIS 3": "10/25/2019",
        "TETANO DOSIS 4": "10/30/2020",
        "TETANO DOSIS 5": "1/26/2024",
        "CURSO VIOLENCIA SEXUAL": "3/14/2024",
        "CURSO VITAL BASICO BLS": "3/14/2024",
        "GESTION DEL DUELO": "3/14/2024",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "1/14/2024",
        "25_RETHUS": "12/30/2021"
    },
    {
        "CEDULA": "1043872938",
        "COVID DOSIS 1": "4/30/2021",
        "COVID DOSIS 2": "5/21/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "12/14/2021",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "5/23/2024",
        "HEPATITIS B DOSIS 1": "8/22/2017",
        "HEPATITIS B DOSIS 2": "9/28/2017",
        "HEPATITIS B DOSIS 3": "9/26/2023",
        "INFLUENZA": "5/23/2024",
        "TETANO DOSIS 1": "5/23/2024",
        "TETANO DOSIS 2": "10/18/2024",
        "TETANO DOSIS 3": "12/18/2024",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "12/6/23",
        "CURSO VITAL BASICO BLS": "12/29/2023",
        "GESTION DEL DUELO": "8/14/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "3/1/25",
        "25_RETHUS": "8/22/2017"
    },
    {
        "CEDULA": "1044432310",
        "COVID DOSIS 1": "4/25/2021",
        "COVID DOSIS 2": "5/16/2021",
        "COVID DOSIS 3": "4/3/22",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "11/4/15",
        "HEPATITIS B DOSIS 1": "9/5/15",
        "HEPATITIS B DOSIS 2": "2/13/2016",
        "HEPATITIS B DOSIS 3": "10/10/21",
        "INFLUENZA": "2/10/24",
        "TETANO DOSIS 1": "11/4/15",
        "TETANO DOSIS 2": "9/5/15",
        "TETANO DOSIS 3": "2/13/2016",
        "TETANO DOSIS 4": "10/11/21",
        "TETANO DOSIS 5": "3/10/0024",
        "CURSO VIOLENCIA SEXUAL": "7/23/2023",
        "CURSO VITAL BASICO BLS": "7/25/2023",
        "GESTION DEL DUELO": "9/17/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "9/19/2023",
        "25_RETHUS": ""
    },
    {
        "CEDULA": "1044609988",
        "COVID DOSIS 1": "10/13/2021",
        "COVID DOSIS 2": "11/17/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "7/19/2022",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "1/13/2024",
        "HEPATITIS B DOSIS 1": "7/30/2022",
        "HEPATITIS B DOSIS 2": "1/13/2024",
        "HEPATITIS B DOSIS 3": "2/15/2024",
        "INFLUENZA": "2/10/24",
        "TETANO DOSIS 1": "7/29/2022",
        "TETANO DOSIS 2": "1/9/22",
        "TETANO DOSIS 3": "1/13/2024",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "5/13/2023",
        "CURSO VITAL BASICO BLS": "9/9/23",
        "GESTION DEL DUELO": "10/1/24",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "12/1/24",
        "25_RETHUS": "8/31/2023"
    },
    {
        "CEDULA": "1046693143",
        "COVID DOSIS 1": "8/11/21",
        "COVID DOSIS 2": "",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "2/25/2019",
        "HEPATITIS B DOSIS 1": "9/11/24",
        "HEPATITIS B DOSIS 2": "9/12/24",
        "HEPATITIS B DOSIS 3": "",
        "INFLUENZA": "2/10/24",
        "TETANO DOSIS 1": "2/25/2019",
        "TETANO DOSIS 2": "12/13/2019",
        "TETANO DOSIS 3": "1/27/2022",
        "TETANO DOSIS 4": "2/10/24",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "10/10/24",
        "CURSO VITAL BASICO BLS": "10/10/24",
        "GESTION DEL DUELO": "10/10/24",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "10/10/24",
        "25_RETHUS": "2/26/2020"
    },
    {
        "CEDULA": "1047335364",
        "COVID DOSIS 1": "3/29/2021",
        "COVID DOSIS 2": "4/17/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "12/13/2021",
        "COVID REFUERZO 2": "11/22/2023",
        "FIEBRE AMARILLA": "",
        "HEPATITIS B DOSIS 1": "8/11/24",
        "HEPATITIS B DOSIS 2": "12/19/2024",
        "HEPATITIS B DOSIS 3": "10/1/25",
        "INFLUENZA": "11/9/24",
        "TETANO DOSIS 1": "",
        "TETANO DOSIS 2": "",
        "TETANO DOSIS 3": "",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "11/22/2023",
        "CURSO VITAL BASICO BLS": "",
        "GESTION DEL DUELO": "11/22/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "",
        "25_RETHUS": "5/3/08"
    },
    {
        "CEDULA": "1048221258",
        "COVID DOSIS 1": "7/30/2021",
        "COVID DOSIS 2": "10/14/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "11/5/22",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "9/2/22",
        "HEPATITIS B DOSIS 1": "11/20/2020",
        "HEPATITIS B DOSIS 2": "12/30/2020",
        "HEPATITIS B DOSIS 3": "3/31/2021",
        "INFLUENZA": "12/6/24",
        "TETANO DOSIS 1": "9/23/2020",
        "TETANO DOSIS 2": "10/23/2024",
        "TETANO DOSIS 3": "5/20/2021",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "3/9/24",
        "CURSO VITAL BASICO BLS": "11/16/2023",
        "GESTION DEL DUELO": "3/11/24",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "11/11/24",
        "25_RETHUS": "8/9/24"
    },
    {
        "CEDULA": "1048286611",
        "COVID DOSIS 1": "3/24/2021",
        "COVID DOSIS 2": "9/21/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "7/15/2024",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "11/7/22",
        "HEPATITIS B DOSIS 1": "11/7/22",
        "HEPATITIS B DOSIS 2": "8/11/24",
        "HEPATITIS B DOSIS 3": "9/12/24",
        "INFLUENZA": "11/9/24",
        "TETANO DOSIS 1": "11/7/22",
        "TETANO DOSIS 2": "10/21/2024",
        "TETANO DOSIS 3": "1/15/2025",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "",
        "CURSO VITAL BASICO BLS": "",
        "GESTION DEL DUELO": "",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "11/18/2023",
        "25_RETHUS": "2/22/2023"
    },
    {
        "CEDULA": "1048317342",
        "COVID DOSIS 1": "10/8/21",
        "COVID DOSIS 2": "7/9/21",
        "COVID DOSIS 3": "12/3/22",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "7/10/24",
        "HEPATITIS B DOSIS 1": "2/14/2022",
        "HEPATITIS B DOSIS 2": "1/4/22",
        "HEPATITIS B DOSIS 3": "5/18/2022",
        "INFLUENZA": "7/10/24",
        "TETANO DOSIS 1": "8/19/2014",
        "TETANO DOSIS 2": "10/28/2021",
        "TETANO DOSIS 3": "3/12/21",
        "TETANO DOSIS 4": "7/10/24",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "6/13/2024",
        "CURSO VITAL BASICO BLS": "3/29/2023",
        "GESTION DEL DUELO": "3/29/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "6/13/2024",
        "25_RETHUS": "12/21/2022"
    },
    {
        "CEDULA": "1129486768",
        "COVID DOSIS 1": "8/18/2021",
        "COVID DOSIS 2": "1/25/2022",
        "COVID DOSIS 3": "9/22/2022",
        "COVID REFUERZO 1": "8/10/24",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "10/30/2018",
        "HEPATITIS B DOSIS 1": "9/15/2021",
        "HEPATITIS B DOSIS 2": "8/11/24",
        "HEPATITIS B DOSIS 3": "1/13/2025",
        "INFLUENZA": "11/22/2024",
        "TETANO DOSIS 1": "7/6/16",
        "TETANO DOSIS 2": "7/19/2016",
        "TETANO DOSIS 3": "10/30/2018",
        "TETANO DOSIS 4": "10/30/2019",
        "TETANO DOSIS 5": "8/10/24",
        "CURSO VIOLENCIA SEXUAL": "11/21/2023",
        "CURSO VITAL BASICO BLS": "11/21/2023",
        "GESTION DEL DUELO": "9/25/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "9/25/2023",
        "25_RETHUS": "6/11/19"
    },
    {
        "CEDULA": "1129490483",
        "COVID DOSIS 1": "3/10/21",
        "COVID DOSIS 2": "3/10/21",
        "COVID DOSIS 3": "3/10/21",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "1/19/2018",
        "HEPATITIS B DOSIS 1": "11/22/2023",
        "HEPATITIS B DOSIS 2": "8/11/24",
        "HEPATITIS B DOSIS 3": "12/18/2024",
        "INFLUENZA": "1/16/2025",
        "TETANO DOSIS 1": "1/19/2018",
        "TETANO DOSIS 2": "3/14/2019",
        "TETANO DOSIS 3": "10/19/2019",
        "TETANO DOSIS 4": "7/22/2021",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "10/5/24",
        "CURSO VITAL BASICO BLS": "10/7/24",
        "GESTION DEL DUELO": "8/30/2023",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "",
        "25_RETHUS": "4/26/2016"
    },
    {
        "CEDULA": "1129523774",
        "COVID DOSIS 1": "7/24/2021",
        "COVID DOSIS 2": "8/17/2021",
        "COVID DOSIS 3": "3/18/2022",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "3/27/2024",
        "HEPATITIS B DOSIS 1": "1/7/19",
        "HEPATITIS B DOSIS 2": "12/10/24",
        "HEPATITIS B DOSIS 3": "8/11/24",
        "INFLUENZA": "5/16/2024",
        "TETANO DOSIS 1": "8/8/09",
        "TETANO DOSIS 2": "2/9/09",
        "TETANO DOSIS 3": "1/18/2010",
        "TETANO DOSIS 4": "10/10/19",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "9/1/24",
        "CURSO VITAL BASICO BLS": "11/1/24",
        "GESTION DEL DUELO": "7/1/24",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "4/1/24",
        "25_RETHUS": "1/22/2025"
    },
    {
        "CEDULA": "1140823153",
        "COVID DOSIS 1": "7/29/2021",
        "COVID DOSIS 2": "2/9/21",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "2/2/22",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "9/11/24",
        "HEPATITIS B DOSIS 1": "8/11/24",
        "HEPATITIS B DOSIS 2": "",
        "HEPATITIS B DOSIS 3": "",
        "INFLUENZA": "10/22/2024",
        "TETANO DOSIS 1": "",
        "TETANO DOSIS 2": "",
        "TETANO DOSIS 3": "11/4/14",
        "TETANO DOSIS 4": "10/22/2024",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "12/30/2024",
        "CURSO VITAL BASICO BLS": "6/14/2024",
        "GESTION DEL DUELO": "12/28/2024",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "12/6/24",
        "25_RETHUS": "9/13/2010"
    },
    {
        "CEDULA": "1143148284",
        "COVID DOSIS 1": "5/19/2021",
        "COVID DOSIS 2": "9/6/21",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "6/29/2024",
        "HEPATITIS B DOSIS 1": "4/25/2013",
        "HEPATITIS B DOSIS 2": "5/25/2013",
        "HEPATITIS B DOSIS 3": "6/29/2024",
        "INFLUENZA": "6/29/2024",
        "TETANO DOSIS 1": "5/25/2013",
        "TETANO DOSIS 2": "6/25/2013",
        "TETANO DOSIS 3": "12/11/13",
        "TETANO DOSIS 4": "6/29/2024",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "4/7/24",
        "CURSO VITAL BASICO BLS": "5/7/24",
        "GESTION DEL DUELO": "6/7/24",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "4/7/24",
        "25_RETHUS": "12/28/2018"
    },
    {
        "CEDULA": "1143465470",
        "COVID DOSIS 1": "5/4/21",
        "COVID DOSIS 2": "4/26/2021",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "10/12/21",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "12/24/2018",
        "HEPATITIS B DOSIS 1": "1/30/2020",
        "HEPATITIS B DOSIS 2": "8/24/2020",
        "HEPATITIS B DOSIS 3": "8/11/24",
        "INFLUENZA": "8/15/2024",
        "TETANO DOSIS 1": "11/23/2018",
        "TETANO DOSIS 2": "12/24/2018",
        "TETANO DOSIS 3": "8/24/2020",
        "TETANO DOSIS 4": "5/27/2023",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "",
        "CURSO VITAL BASICO BLS": "",
        "GESTION DEL DUELO": "",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "",
        "25_RETHUS": ""
    },
    {
        "CEDULA": "",
        "COVID DOSIS 1": "",
        "COVID DOSIS 2": "",
        "COVID DOSIS 3": "",
        "COVID REFUERZO 1": "",
        "COVID REFUERZO 2": "",
        "FIEBRE AMARILLA": "",
        "HEPATITIS B DOSIS 1": "",
        "HEPATITIS B DOSIS 2": "",
        "HEPATITIS B DOSIS 3": "",
        "INFLUENZA": "",
        "TETANO DOSIS 1": "",
        "TETANO DOSIS 2": "",
        "TETANO DOSIS 3": "",
        "TETANO DOSIS 4": "",
        "TETANO DOSIS 5": "",
        "CURSO VIOLENCIA SEXUAL": "",
        "CURSO VITAL BASICO BLS": "",
        "GESTION DEL DUELO": "",
        "24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO": "",
        "25_RETHUS": ""
    }
  ];

  processData(){
    const arr = [];
    for (let i = 0; i < this.json.length; i++) {
      for (let j = 0; j < 20; j++) {
              const vari = [
                    'COVID DOSIS 1',
                    'COVID DOSIS 2',
                    'COVID DOSIS 3',
                    'COVID REFUERZO 1',
                    'COVID REFUERZO 2',
                    'FIEBRE AMARILLA',
                    'HEPATITIS B DOSIS 1',
                    'HEPATITIS B DOSIS 2',
                    'HEPATITIS B DOSIS 3',
                    'INFLUENZA',
                    'TETANO DOSIS 1',
                    'TETANO DOSIS 2',
                    'TETANO DOSIS 3',
                    'TETANO DOSIS 4',
                    'TETANO DOSIS 5',
                    'CURSO VIOLENCIA SEXUAL',
                    'CURSO VITAL BASICO BLS',
                    'GESTION DEL DUELO',
                    '24_ATENCION DE VICTIMAS DE DESPLAZAMIENTO FORZOSO',
                    '25_RETHUS',
              ];
              const rawDate = this.json[i][vari[j]] || '01/01/1900';
            const formattedDate = this.formatDate(rawDate); // Llamamos a la función de formato

            const obj = {
                cedula: this.json[i].CEDULA,
                concepto: vari[j],
                fecha: formattedDate
            };
            arr.push(obj);
        }
    }
    console.log(arr);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '01/01/1900';

    const parts = dateStr.split('/');
    if (parts.length !== 3) return '01/01/1900';

    let day: string, month: string, year: string;

    // Si el segundo valor (parts[1]) es mayor que 12, asumimos que es el día y el primer valor es el mes
    if (parseInt(parts[1]) > 12) {
        day = parts[1].padStart(2, '0');
        month = parts[0].padStart(2, '0');
    } else {
        day = parts[0].padStart(2, '0');
        month = parts[1].padStart(2, '0');
    }

    // Aseguramos que el año tenga 4 dígitos
    year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];

    return `${day}/${month}/${year}`;
}
}
