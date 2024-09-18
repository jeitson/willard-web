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
      id: 1,
      statusDescription: '200 - Ok',
      method: 'POST',
      title: 'Creación de usuarios',
      statusCode: '200',
      createdAt: '2024-08-01',
      timeAt: '10:30 AM',
      userName: 'Aldair Guerrero',
      roleName: 'Admin',
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
      response: {
        dato1: 'Prueba',
        dato2: 'test',
        dato3: 'prueba 2',
        dato4: 'chao de aqui',
      },
    }
  ];
  audit: any = {};
  activeDetail = false;
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
    this.getAudists();
  }

  getAudists(): void {
    this._Service.getAudits().subscribe({
      next: (response: any) => {
        this.listData = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
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
