import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdviserService } from 'src/app/core/services/process/adviser.service';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CustomersService } from 'src/app/core/services/process/customers.service';
import { RequestsService } from 'src/app/core/services/requests/requests.service';
import { PickuplocationService } from 'src/app/core/services/settings/pickuplocation.service';
import { SettingsService } from 'src/app/core/services/settings/settings.service';
import { ToastService } from 'src/app/core/services/toast.service';
declare var $: any;

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
  listTransportador: any[] = [];
  adviser: any[] = [];
  listTipos: any[] = [];
  listData: any[] = [];

  action = { name: 'LOGISTICA' };
  constructor(
    private _Customers: CustomersService,
    private _Conveyor: ConvenyorService,
    private _Settings: SettingsService,
    private _requests: RequestsService,
    private _adviser: AdviserService,
    private _pickUp: PickuplocationService,
    private _toast: ToastService,
    private _Service: CentersService
  ) {}
  ngOnInit(): void {
    this.getRequest();
    this.getData();
  }
  getRequest() {
    this._requests.listSolicitudes('3').subscribe((response: any) => {
      console.log(response.data.items);
      this.listsrequest = response.data.items;
    });
  }

  getData() {
    console.log('dataa111')
    forkJoin({
      transportadores: this._Conveyor.getTransportadores(),
      dataAdviser: this._adviser.getConsultants(),
      centers: this._Service.getCollectionSites(),
    }).subscribe({
      next: ({ transportadores, dataAdviser, centers }) => {
        console.log('dataa')
        console.log(transportadores, dataAdviser, centers);
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  createRequest(item: any) {
    // Lógica para crear la solicitud
    console.log(item);
    this.data = {
      id: item.id,
      collectionSiteId: item.collectionSite,
      consultantId: item.consultant,
      transporterId: item.transporter,
    };

    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }
  viewRequest() {
    $('#modalDetail').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }

  saveData() {
    this._requests
      .updateSolicitud(this.data.id, {
        collectionSiteId: this.data.collectionSiteId,
        consultantId: this.data.consultantId,
        transporterId: this.data.transporterId,
      })
      .subscribe((x: any) => {
        this._toast.success('Completado', 'Ruta Actualizada exitosamente');
        // Si la respuesta es positiva
        $('#modalRequest').modal('hide');
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
}
