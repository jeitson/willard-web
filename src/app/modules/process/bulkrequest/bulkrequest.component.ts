import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneralService } from 'src/app/core/services/general.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { ToastService } from 'src/app/core/services/toast.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ApiService } from 'src/app/core/services/api/api.service';
declare var bootstrap: any;
@Component({
  selector: 'app-bulkrequest',
  templateUrl: './bulkrequest.component.html',
  styleUrls: ['./bulkrequest.component.css'],
})
export class BulkrequestComponent {
  cardJson = { tab: 'L', Name: 'crear masive' };
  tableData: Array<{
    Nombre: string;
    referenciaWll: string;
    referenciaPh: string;
  }> = [];
  guide: any;
  modalConfirm: any;
  modaldetalle: any;
  formattedData: any[] = []; // Variable para almacenar los datos fusionados
  uploadedFile: File | null = null; // Variable para almacenar el archivo cargado
  detailData: any[] = [];
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  pageSize: number = 10; // Tamaño de la página (puedes cambiarlo según tus necesidades)
  pagesArray: number[] = []; // Array para las opciones del select
  listBase: any[] = [];
  ListProduct: any;
  searchTerm$ = new Subject<any>();
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  idGuide: any;
  listPending: any[] = [];
  selectedItem: any;
  constructor(
    private _general: GeneralService,
    private _toast: ToastService,
    private _request: RequestsService,
    private _http: ApiService,
  ) {}
  ngOnInit(): void {
    this.modalConfirm = new bootstrap.Modal(
      document.getElementById('modalconfirm'),
      { backdrop: 'static', keyboard: false }
    );

    this.modaldetalle = new bootstrap.Modal(
      document.getElementById('modaldetalle'),
      { backdrop: 'static', keyboard: false }
    );
    this.get(this.currentPage);
  }

  // Método para obtener datos con paginación
  get(page: number) {
    this._http.get('transporter-travel').subscribe((response: any) => {
      console.log(response);

      this.detailData = response.data.items; // Datos de la tabla
      this.listBase = this.detailData;
      this.totalPages = response.data.meta.totalPages; // Total de páginas
      this.currentPage = page; // Actualizar la página actual
      this.generatePagesArray(); // Generar el array de páginas para el select
      this.search();
      this.getSolicitudPending();
    });
  }
  selectedItems: any[] = [];

  getSolicitudPending() {
    this._request.getSolicitudPending().subscribe((response: any) => {
      console.log(response);
      this.listPending = response.data;
    });
  }

  getPendingRequest() {
    const routeIds = this.selectedItems.map((item) => item.routeId);
    const uniqueRouteIds = [...new Set(routeIds)];

    // Verificar si hay duplicados
    if (routeIds.length !== uniqueRouteIds.length) {
      this._toast.info('ERROR', 'Hay valores duplicados en los routeId.');
      return;
    }

    const requestBody = { routes: uniqueRouteIds };

    console.log(requestBody);

    this._request.getPendingRequests(requestBody).subscribe((item: any) => {
      console.log(item);
      this.exportToExcel(item);
    });
  }

  exportToExcel(data: any[], fileName: string = 'Reporte.xlsx') {
    console.log(data);
    if (!data || data.length === 0) {
        console.error('No hay datos para exportar.');
        return;
    }

    // Obtener las claves del primer objeto como encabezados
    const headers = Object.keys(data[0]);

    // Convertir los datos a una hoja de cálculo
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: headers });

    // Ajustar el ancho de las columnas automáticamente
    worksheet['!cols'] = headers.map((header) => ({ wch: header.length + 5 }));

    // Crear el libro de trabajo
    const workbook: XLSX.WorkBook = {
        Sheets: { Datos: worksheet },
        SheetNames: ['Datos'],
    };

    // Generar el archivo Excel en formato binario
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Crear un Blob y descargar el archivo
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, fileName);
}

  addToTable() {
    if (this.selectedItem) {
      // Buscar el objeto en listPending
      const selectedObject = this.listPending.find(
        (item) => item.id === this.selectedItem
      );

      if (selectedObject) {
        // Verificar si el routeId ya está en selectedItems
        const exists = this.selectedItems.some(
          (item) => item.routeId === selectedObject.routeId
        );

        if (exists) {
          this._toast.info('ERROR', 'YA EXISTE EL ROUTER SELECCIONADO.');
          return;
        }

        // Agregarlo a la tabla
        this.selectedItems.push(selectedObject);
        // Removerlo de la lista del select
        this.selectedItem = null;
      }
    }
  }

  // Eliminar de la tabla y regresar al select
  removeFromTable(item: any) {
    // Regresar el objeto a la lista del select
    this.listPending.push(item);
    // Removerlo de la tabla
    this.selectedItems = this.selectedItems.filter((i) => i.id !== item.id);
  }

  // Método para generar el array de páginas para el select
  generatePagesArray() {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Método para cambiar de página desde el select
  onPageChange(event: any) {
    const selectedPage = Number(event.target.value);
    this.get(selectedPage);
  }

  // Método para ir a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.get(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.get(this.currentPage + 1);
    }
  }
  viewData(item: any) {
    this.ListProduct = item;
    this.modaldetalle.show();
  }
  sumQuantity(item: any) {
    return item.reduce(
      (sum: any, product: any) => (sum += Number(product.quantity)),
      0
    );
  }

  // Método para enviar el archivo al backend

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file; // Guardar el archivo cargado

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Cabeceras esperadas
        const expectedHeadersPrincipal = [
          'idRuta',
          'idGuia',
          'tipo',
          'secuencia',
          'fechaMov',
          'horaMov',
          'planeador',
          'zona',
          'ciudad',
          'depto',
          'placa',
          'conductor',
          'nombreSitio',
          'direccion',
          'posGps',
          'totCant',
          'docReferencia',
          'docReferencia2',
          'urlSoportes',
          'detalles',
        ];

        const expectedHeadersDetalle = ['idGuia', 'tipoBat', 'cantidad'];

        let principalData: any[] = [];
        let detalleData: any[] = [];

        workbook.SheetNames.forEach((sheetName: string) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData: any = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Obtener como array de arrays
          console.log(jsonData);
          if (jsonData.length > 0) {
            const headers = jsonData[0].map((header: any) =>
              header.toString().trim()
            );

            if (sheetName === 'principal') {
              if (!this.validateHeaders(headers, expectedHeadersPrincipal)) {
                this._toast.error(
                  'Error en el cargue',
                  `Error: Las cabeceras de la hoja '${sheetName}' no coinciden.`
                );

                return;
              }
              principalData = XLSX.utils.sheet_to_json(sheet);
            } else if (sheetName === 'detalle') {
              if (!this.validateHeaders(headers, expectedHeadersDetalle)) {
                this._toast.error(
                  'Error en el cargue',
                  `Error: Las cabeceras de la hoja '${sheetName}' no coinciden.`
                );
                return;
              }
              detalleData = XLSX.utils.sheet_to_json(sheet);
            }
          }
        });

        // Validación de tipos de datos en 'principal'
        const isValidPrincipal = this.validateDataTypes(principalData, {
          idRuta: 'string',
          idGuia: 'number',
          tipo: 'string',
          secuencia: 'number',
          fechaMov: 'number',
          horaMov: 'number',
          planeador: 'number',
          zona: 'string',
          ciudad: 'string',
          depto: 'string',
          placa: 'string',
          conductor: 'string',
          nombreSitio: 'string',
          direccion: 'string',
          posGps: 'string',
          totCant: 'number',
          docReferencia: 'string',
          docReferencia2: 'string',
          urlSoportes: 'string',
          detalles: 'string',
        });

        // Validación de tipos de datos en 'detalle'
        const isValidDetalle = this.validateDataTypes(detalleData, {
          idGuia: 'number',
          tipoBat: 'string',
          cantidad: 'number',
        });

        // if (!isValidPrincipal || !isValidDetalle) {
        //   this._toast.error(
        //     'Error:',
        //     ' Algunos datos no cumplen con el tipo esperado.'
        //   );
        //   return;
        // }

        // Transformar datos
        console.log(principalData);
        const transformedData = principalData
        .map((item) => {
          const detalles = JSON.parse(item.detalles || '[]');
          return detalles.map((detalle: any) => {
            const { fecha, hora } = this.convertirFechaHora(item.fechaMov, item.horaMov);
            console.log(fecha, hora)
            return {
              idGuia: item.idGuia,
              tipoBat: detalle.tipoBat,
              cantidad: detalle.cantidades,
              fechaMov: fecha, // Fecha en formato YYYY-MM-DD
              horaMov: hora, // Hora en formato HH:mm
              ...item,
            };
          });
        })
        .flat();

        console.log(transformedData);
        this.formattedData = transformedData;
      };
      reader.readAsArrayBuffer(file);
    }
  }
  convertirFechaHora(fechaMov: number, horaMov: number) {
    // Convertir la fecha de formato serial de Excel a formato "YYYY-MM-DD"
    const fechaBase = new Date(1899, 11, 30); // 30 de diciembre de 1899
    const fecha = new Date(fechaBase.getTime() + fechaMov * 86400000);
    const fechaFormateada = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
  
    // Convertir la hora de formato decimal de Excel a "HH:mm"
    const totalMinutes = Math.round(horaMov * 1440); // 1440 minutos en un día
    const horas = Math.floor(totalMinutes / 60);
    const minutos = totalMinutes % 60;
    const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  
    return { fecha: fechaFormateada, hora: horaFormateada };
  }
  
  // Función para validar las cabeceras
  validateHeaders(headers: string[], expectedHeaders: string[]): boolean {
    return expectedHeaders.every((header) => headers.includes(header));
  }

  // Función para validar los tipos de datos en las filas
  validateDataTypes(
    data: any[],
    expectedTypes: { [key: string]: string }
  ): boolean {
    return data.every((row) =>
      Object.keys(expectedTypes).every((key) => {
        const value = row[key];
        const expectedType = expectedTypes[key];
        return (
          (expectedType === 'number' && !isNaN(Number(value))) ||
          (expectedType === 'string' && typeof value === 'string') ||
          (expectedType === 'date' && !isNaN(Date.parse(value)))
        );
      })
    );
  }

  sendFileToBackend(): void {
    if (!this.uploadedFile) {
      this._toast.error('Error:', 'No hay archivo cargado para enviar.');
      return;
    }

    this._toast.info('Enviando archivo...', this.uploadedFile.name);

    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    this._general.uploadFile(this.uploadedFile).subscribe({
      next: (response: any) => {
        this._toast.success(
          'Archivo enviado con éxito.',
          `Respuesta: ${response}`
        );
        this.get(this.currentPage);
        this.cardJson.tab = 'L';
      },
      error: (error) => {
        console.error('Error al enviar el archivo:', error);
        this._toast.error(
          'Error al enviar el archivo.',
          error?.message || 'Intente de nuevo.'
        );
      },
    });
  }

  // Método para recargar la página
  reloadPage(): void {
    window.location.reload();
  }

  editData(item: any) {
    // Asignar los valores de la guía y el ID
    this.guide = item.guideId;
    this.idGuide = item.id;

    // Mostrar el modal de confirmación
    this.modalConfirm.show();
  }

  updateGuide() {
    // Validar que this.guide y this.idGuide no sean nulos o indefinidos
    if (!this.guide || !this.idGuide) {
      this._toast.error(
        'ERROR',
        'Error: La guía o el ID no pueden ser nulos o indefinidos.'
      );
      return;
    }

    // Crear el objeto de datos para la actualización
    const data = { idGuia: this.guide };

    // Realizar la actualización usando el servicio
    this._general.UpdateGuia(this.idGuide, data).subscribe({
      next: (response: any) => {
        // Manejar la respuesta exitosa
        this._toast.success('Solicitud Enviada', 'Guía actualizada con éxito');
        this.clearState(); // Limpiar el estado después de la actualización
        this.modalConfirm.hide();
        this.get(this.currentPage);
      },
      error: (error: any) => {
        // Manejar el error
        this._toast.error(
          'ERROR',
          `Error al actualizar la guía: ${error.message || 'Error desconocido'}`
        );
        this.clearState(); // Limpiar el estado en caso de error
      },
    });
  }

  // Método para limpiar el estado después de la actualización
  clearState() {
    this.guide = null;
    this.idGuide = null;
  }
  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      this.detailData = this.listBase.filter((item) => {
        const itemValues = Object.values(item);
        return itemValues.some((item) =>
          String(item).toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }
  errorMessage: string = '';
  guideLength: number = 10; // Longitud permitida
  validateGuide() {
    const regex = new RegExp(`^\\d{${this.guideLength}}$`); // Solo números con la longitud exacta
    const numValue = Number(this.guide); // Convertimos el input a número

    if (!regex.test(this.guide) || numValue <= 0 || numValue >= 15) {
      this.errorMessage = `El número de guía debe contener exactamente ${this.guideLength} dígitos y ser válido.`;
    } else {
      this.errorMessage = '';
    }
  }
}
//
