import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RequestService } from 'src/app/core/services/security/request.service';

@Component({
  selector: 'wlrd-request-logs',
  templateUrl: './request-logs.component.html',
  styleUrls: ['./request-logs.component.scss'],
})
export class RequestLogsComponent {
  listData: any[] = [
    {
      Id: 1,
      status: '200 - Ok',
      title: 'Creación de usuarios',
      statusCode: '200',
      fechaRegistro: '2024-08-01',
      horaRegistro: '10:30 AM',
      payload: {
        username: 'my_username',
        password: 'my_password',
        validationfactors: {
           validationFactors: [
              {
                 name: 'remote_address',
                 value: '127.0.0.1'
              }
           ]
        }
      },
      result: {
        dato1: 'Prueba',
        dato2: 'test',
        dato3: 'prueba 2',
        dato4: 'chao de aqui',
      },
      Observacion: 'Observación de prueba',
    }
  ];

  errorOptions = [
    { value: 'all', label: 'Todos' },
    { value: '200', label: 'Status 200 - Ok' },
    { value: '400', label: 'Status 400 - Bad Request' },
    { value: '401', label: 'Status 401 - Unauthorized' },
    { value: '403', label: 'Status 403 - Forbidden' },
    { value: '404', label: 'Status 404 - Not Found' },
    { value: '500', label: 'Status 500 - Internal Server Error' },
  ];

  viewInfo = 'List';
  viewSection = true;
  selectedNotificationId: number | null = null;

  notify = {
    TipoProcesoNotifcacionId: '',
    FechaInicio: '',
    FechaFin: ''
  };
  constructor(
    private _Service: RequestService,
  ) {}

  ngOnInit(): void {
    this.selectData();
  }
  selectData(): void {
    forkJoin({
      users: this._Service.getAudits(),
    }).subscribe({
      next: (data: any ) => {
        //this.listData = data.items;
        console.log(this.listData);
      },
      error: (error: any) => {
        console.error('Error al obtener datos:', error);
      },
    });
  }

  selectNotification(notificationId: number) {
    this.selectedNotificationId = notificationId;
  }

  getColorBg(status: string){
    let color = '';
    switch (status) {
      case '200':
        color = 'bg-success'
        break;
      case '400':
        color = 'bg-danger'
        break;
      case '401':
        color = 'bg-warning'
        break;
      case '403':
        color = 'bg-warning'
        break;
      case '404':
        color = 'bg-info'
        break;
      case '500':
        color = 'bg-danger'
        break;

      default:
        break;
    }
    return color;
  }
}
