import { Component } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { AdviserService } from 'src/app/core/services/process/adviser.service';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { UsersService } from 'src/app/core/services/security/users.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
declare var bootstrap: any;

@Component({
  selector: 'wlrd-requestlogistics',
  templateUrl: './requestlogistics.component.html',
  styleUrls: ['./requestlogistics.component.scss'],
})
export class RequestlogisticsComponent {
  request = {
    specialPlanner: '',
    changeRetriever: '',
    transporter: '',
    driver: '',
    estimatedKG: 0,
    isSpecial: false, // Asegúrate de que este valor se actualice según sea necesario en tu aplicación
  };

  data = {
    id: '',
    collectionSiteId: '',
    consultantId: '',
    transporterId: '',
  };

  listsrequest: any[] = [];
  listTransportadores: any[] = [];
  listDataAdviser: any[] = [];
  users: any[] = [];
  listCenters: any[] = [];
  modal: any;
  action = { name: 'LOGISTICA' };

  searchTerm$ = new Subject<any>();

  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  filteredList: any[] = []; // La lista filtrada
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  paginatedList: any = [];
  listCopy: any[] = [];
  roleId: any;
  constructor(
    private _Customers: CustomersService,
    private _Conveyor: ConvenyorService,
    private _Settings: SettingsService,
    private _requests: RequestsService,
    private _adviser: AdviserService,
    private _pickUp: PickuplocationService,
    private _toast: ToastService,
    private _Service: CentersService,
    private userService: UsersService
  ) {}
  ngOnInit(): void {
      this.roleId = sessionStorage.getItem('RoleId');
    this.modal = new bootstrap.Modal(
      document.getElementById('modalRequestlogistics'),
      { backdrop: 'static', keyboard: false }
    );
    this.getRequest(this.currentPage);
    this.getData();
  }
  getRequest(page: any) {
      const module = this.roleId === '22' ? 'WL' : undefined;
    this._requests.listSolicitudes(page, module).subscribe((response: any) => {
      this.listsrequest = response.data.items;
      this.listCopy = this.listsrequest; // Hacemos una copia de la lista original
      this.totalItems = this.listsrequest.length; // Total de solicitudes
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de páginas
      this.search();
    });
  }

  getData() {
    this.getTransportadores();
    this.getAsesores(); // Llamar al siguiente método

  }

  private getTransportadores() {
    this._Conveyor.getTransportadores().subscribe({
      next: (transportadoresResponse: any) => {
        const transportadores = transportadoresResponse.data.items;
        this.listTransportadores = transportadores; // Almacenar los transportadores
      },
      error: (error: any) => {
        console.error('Error al obtener transportadores:', error);
      },
    });
  }

  private getAsesores() {
    this.userService.getProfile().subscribe({
      next: (dataAdviserResponse: any) => {
        const dataAdviser = dataAdviserResponse.data;
        console.log(dataAdviser);
        this.listDataAdviser = dataAdviser; // Almacenar los asesores
      },
      error: (error: any) => {
        console.error('Error al obtener asesores:', error);
      },
    });

    this.userService.allUsers().subscribe({
      next: (usersResponse: any) => {
        const users = usersResponse.data.items;
        // Filtrar usuarios con rol "PLANEADOR DE TRANSPORTE" y roleId "14"
        const filteredUsers = users.filter((user: any) =>
          user.roles.some(
            (role: any) =>
              role.role.name === 'PLANEADOR DE TRANSPORTE' &&
              role.roleId === '14'
          )
        );

        this.users = filteredUsers;
      },
    });
  }

  private getCentros(item: any) {
    this._Service.getCollectionSitesPickup(item).subscribe({
      next: (centersResponse: any) => {
        const centers = centersResponse.data.items;
        this.listCenters = centers; // Almacenar los centros
      },
      error: (error: any) => {
        console.error('Error al obtener centros:', error);
      },
    });
  }

  createRequest(item: any) {
    console.log(item);
    // Lógica para crear la solicitud
    this.data = {
      id: item.id,
      collectionSiteId: item.pickUpLocation.id,
      consultantId: item.consultant,
      transporterId: item.transporter,
    };
    this.getCentros(item.pickUpLocation.id); // Llamar al siguiente método
    this.modal.show();
  }

  saveData() {
    this._requests
      .completeSolicitud(this.data.id, {
        collectionSiteId: this.data.collectionSiteId,
        consultantId: this.data.consultantId,
        transporterId: this.data.transporterId,
      })
      .subscribe((x: any) => {
        this._toast.success('Completado', 'Ruta Actualizada exitosamente');
        // Si la respuesta es positiva
        this.getRequest(this.currentPage);
        this.modal.hide();
        this.clearData();
      });
  }

  clearData() {
    this.data = {
      id: '',
      collectionSiteId: '',
      consultantId: '',
      transporterId: '',
    };
  }

  // paginación
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listsrequest.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
      this.getRequest(page);
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

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      const lowerValue = value.toLowerCase();
      this.listsrequest = this.listCopy.filter((item) =>
        [
          item.id?.toString(), // Id
          item.requestDate, // Fecha
          item.pickUpLocation?.name, // Acopio
          item.estimatedQuantity?.toString(), // Cantidad
          item.estimatedPickUpDate, // Recogida
          item.client?.name, // Cliente
        ].some((field) => field?.toLowerCase().includes(lowerValue))
      );
    });
  }
}
