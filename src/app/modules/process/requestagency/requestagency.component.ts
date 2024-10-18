import { Component } from '@angular/core';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Subject } from 'rxjs';
declare var bootstrap: any;
@Component({
  selector: 'wlrd-requestagency',
  templateUrl: './requestagency.component.html',
  styleUrls: ['./requestagency.component.scss'],
})
export class RequestagencyComponent {
  // constructor(private) {}
  action = { name: 'Crear' }; // o 'Actualizar' según el caso
  viewoptions = true; // true para crear, false para actualizar
  modal: any;

  request: any = {
    clientId: '',
    description: '',
    productTypeId: '',
    estimatedPickUpDate: '',
    estimatedPickUpTime: '',
    estimatedQuantity: '',
    estimatedKG: '',
    isSpecial: false,
    motiveSpecialId: '',
    transporterId: '',
    pickUpLocationId: '',
    observations: '',
    recommendations: '',
  };

  selectedClient: any = null;
  selectedTransportador: any = null;
  selectedTipo: any = null;
  listClient: any = [];
  listTransportador: any = [];
  listData: any = [];
  listTipos: any = [];
  listSedes: any = [];
  listCiudades: any = [];
  listZonas: any = [];
  listsrequest: any[] = [];
  listCopy: any[] = [];

  listmotive: any[] = [];

  dataId: any;
  actionSave = false;
  roleId: any;
  isSpecialDisabled = false;
  typeProduct: any = [];
  minDate: string;
  maxDate: string;
  searchTerm$ = new Subject<any>();

  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  filteredList: any[] = []; // La lista filtrada
  currentPage = 1;
  itemsPerPage = 3;
  totalItems = 0;
  totalPages = 0;
  paginatedList: any = [];
  constructor(
    private _Customers: CustomersService,
    private _Conveyor: ConvenyorService,
    private _Settings: SettingsService,
    private _requests: RequestsService,
    private _pickUp: PickuplocationService,
    private _toast: ToastService
  ) {
    const today = new Date();
    const futureDate = new Date();
    // Configura la fecha límite a 2 años a partir de la fecha actual
    futureDate.setFullYear(today.getFullYear() + 2);

    // Formato de las fechas en formato 'yyyy-MM-dd' para el input de tipo 'date'
    this.minDate = today.toISOString().split('T')[0];
    this.maxDate = futureDate.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.getRequest();
    this.getData();
    this.modal = new bootstrap.Modal(
      document.getElementById('modalRequestAgency'),
      { backdrop: 'static', keyboard: false }
    );
    this.roleId = sessionStorage.getItem('RoleId');
    // Obtener el objeto guardado en sessionStorage
    // Si el roleId es 16, deshabilita el checkbox
    if (this.roleId === '16') {
      this.isSpecialDisabled = true;
      this.request.isSpecial = true;
    }
    this.filteredList = this.paginatedList;
  }

  // getRequest() {
  //   this._requests.listSolicitudes().subscribe((response: any) => {
  //     this.listsrequest = response.data.items;
  //   });
  // }

  getRequest() {
    this._requests.listSolicitudes().subscribe((response: any) => {
      this.listsrequest = response.data.items;
      this.listCopy = [...response.data.items]; // Hacemos una copia de la lista original
      this.totalItems = this.listsrequest.length; // Total de solicitudes
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de páginas
      this.updatePaginatedList(); // Llamada para paginar los resultados
    });
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listsrequest.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
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
  getData() {
    this._Conveyor.getTransportadores().subscribe({
      next: (response: any) => {
        this.listTransportador = response.data.items;
        console.log(this.listTransportador);
      },
      error: (error: any) => {
        console.error('Error al obtener transportadores:', error);
      },
    });

    this._Customers.getClients().subscribe({
      next: (response: any) => {
        this.listClient = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener clientes:', error);
      },
    });

    this._pickUp.getPickUpLocations().subscribe({
      next: (response: any) => {
        this.listTipos = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener tipos de recogida:', error);
      },
    });

    this._Settings.getCatalogChildrenByKey('TIPOS_SEDES_ACOPIO').subscribe({
      next: (response: any) => {
        this.listSedes = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener tipos de sedes:', error);
      },
    });
    this._Settings.getCatalogChildrenByKey('TIPO_PRODUCTO').subscribe({
      next: (response: any) => {
        this.typeProduct = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener ciudades:', error);
      },
    });

    this._Settings.getCatalogChildrenByKey('CIUDAD').subscribe({
      next: (response: any) => {
        this.listCiudades = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener ciudades:', error);
      },
    });

    this._Settings.getCatalogChildrenByKey('ZONA').subscribe({
      next: (response: any) => {
        this.listZonas = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener zonas:', error);
      },
    });

    this._Settings.getCatalogChildrenByKey('ZONA').subscribe({
      next: (response: any) => {
        this.listZonas = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener zonas:', error);
      },
    });
    this._Settings.getCatalogChildrenByKey('MOTIVO_ESPECIAL').subscribe({
      next: (response: any) => {
        this.listmotive = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener tipos de sedes:', error);
      },
    });
  }
  createRequest() {
    this.clearData();
    this.actionSave = false;
    // Lógica para crear la solicitud
    this.modal.show();
  }

  updateRequest(item: any) {
    console.log(item);
    this.actionSave = true;
    this.modal.show();
    // Lógica para actualizar la solicitud
    this.dataId = item;
    this.request = {
      clientId: item.client.id, // Cambiado de item.clientId a item.client.businessName
      description: item.description,
      productTypeId: item.productTypeId,
      estimatedPickUpDate: item.estimatedPickUpDate,
      estimatedPickUpTime: item.estimatedPickUpTime,
      estimatedQuantity: item.estimatedQuantity,
      estimatedKG: item.estimatedKG,
      isSpecial: item.isSpecial,
      motiveSpecialId: item.motiveSpecial?.id,
      transporterId: '',
      pickUpLocationId: item.pickUpLocation.id, // Aquí se obtiene el ID de la ubicación de recogida
      observations: item.observations,
      recommendations: item.recommendations,
    };
  }

  selectItem(
    id: string,
    list: any[],
    target: 'selectedClient' | 'selectedTransportador' | 'selectedTipo'
  ) {
    this[target] = list.find((item: any) => item.id === id);
  }

  clearData() {
    this.request = {
      clientId: '',
      description: '',
      productTypeId: '',
      estimatedPickUpDate: '',
      estimatedPickUpTime: '',
      estimatedQuantity: '',
      estimatedKG: '',
      isSpecial: this.isSpecialDisabled ? true : false,
      motiveSpecialId: '',
      transporterId: '',
      pickUpLocationId: '',
      observations: '',
      recommendations: '',
    };
    this.selectedClient = null;
  }

  saveRequest() {
    // Validar que todos los campos requeridos no estén vacíos
    if (this.validateFields()) {
      const action = this.actionSave
        ? this._requests.updateSolicitud(this.dataId.id, this.request)
        : this._requests.createSolicitud(this.request);

      action.subscribe({
        next: (response: any) => {
          this._toast.success('Completado', 'Ruta registrada exitosamente');
          // Si la respuesta es positiva
          this.modal.hide();

          this.dataId = []; // Limpiar los objetos
          this.clearData();
          this.getRequest();
        },
        error: (err) => {
          console.error(err); // Puedes registrar el error en la consola
          this._toast.error(
            'Error',
            'Ocurrió un error al procesar la solicitud. Intente nuevamente.'
          );
        },
      });
    } else {
      this._toast.info(
        'Error',
        'Por favor complete todos los campos obligatorios.'
      );
    }
  }

  estimatedKGError: boolean = false; // Variable para almacenar el estado de error

  validateEstimatedKG(): void {
    const estimatedKG = this.request.estimatedKG;
    if (estimatedKG > 10000) {
      this.estimatedKGError = true; // Establecer el error si es mayor a 10,000
    } else {
      this.estimatedKGError = false; // Limpiar el error si es válido
    }
  }
  // Inicializar labelsValidation para rastrear qué campos son inválidos
  labelsValidation: any = {
    clientId: false,
    description: false,
    productTypeId: false,
    estimatedPickUpDate: false,
    estimatedPickUpTime: false,
    estimatedQuantity: false,
    estimatedKG: false,
    isSpecial: false,
    motiveSpecialId: false,
    transporterId: false,
    pickUpLocationId: false,
    observations: false,
    recommendations: false,
  };

  // Función para validar que no hay campos vacíos
  validateFields(): boolean {
    // Reiniciar las validaciones
    Object.keys(this.labelsValidation).forEach(
      (key) => (this.labelsValidation[key] = false)
    );

    let allFieldsValid = true;

    // Validar los campos generales, excluyendo motiveSpecialId y transporterId
    for (const [key, value] of Object.entries(this.request)) {
      if (
        (key !== 'motiveSpecialId' && key !== 'transporterId' && !value) ||
        (key === 'motiveSpecialId' && this.request.isSpecial && !value) ||
        (key === 'transporterId' && !this.request.isSpecial && !value)
      ) {
        this.labelsValidation[key] = true; // Marcar como inválido
        allFieldsValid = false;
      }
    }

    // Validar si el peso estimado es mayor a 10,000
    if (this.request.estimatedKG > 10000) {
      this.labelsValidation.estimatedKG = true; // Marcar como inválido
      allFieldsValid = false;
    }

    return allFieldsValid;
  }

  onSearchChange(value: string): void {
    // Filtra la lista según el valor de búsqueda
    if (!value) {
      this.listsrequest = [...this.listCopy]; // Restablecer la lista original si no hay búsqueda
    } else {
      this.listsrequest = this.listCopy.filter((item: any) => {
        const itemValues: any = Object.values(item);
        return itemValues.some((val: string) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        );
      });
    }
    this.updatePaginatedList(); // Actualiza la lista paginada después del filtrado
  }
}
