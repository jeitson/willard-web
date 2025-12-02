import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { ReportsService } from 'src/app/core/services/process/reports.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-report-file',
  templateUrl: './report-file.component.html',
  styleUrls: ['./report-file.component.css'],
})
export class ReportFileComponent {
  filters = {
    startDate: '',
    endDate: '',
    invoiceNumber: '',
    agency: '',
    erc: '',
  };
  constructor(
    private _report: ReportsService,
    private _Center: CentersService,
    private _toast: ToastService,
    private http: HttpClient
  ) {}

  downloadReport() {
    const params = {
      startDate: this.filters.startDate || '',
      endDate: this.filters.endDate || '',
    };

    this.http
      .get(
        `https://willard-backend.onrender.com/api/reports/cruce-ph-recuperador`,
        {
          params,
          responseType: 'blob',
          observe: 'response',
        }
      )
      .subscribe({
        next: (resp: HttpResponse<Blob>) => {
          console.log('MIME TYPE recibido:', resp.body?.type);
          resp.body?.text().then((t) => console.log('Contenido recibido:', t));

          // Obtener nombre del archivo desde headers
          const contentDisposition = resp.headers.get('Content-Disposition');
          let filename = `Reporte_${Date.now()}.xlsx`;

          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            if (match) filename = match[1];
          }

          // Descargar archivo
          const blob = new Blob([resp.body!], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        },

        error: () => {
          this._toast.error('Error', 'No se pudo generar el reporte');
        },
      });
  }
}
