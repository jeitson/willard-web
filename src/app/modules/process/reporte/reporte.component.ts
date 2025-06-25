import { Component } from '@angular/core';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { ReportsService } from 'src/app/core/services/process/reports.service';
import { Certificate } from 'src/app/core/utils/pdf/pdf_certificate';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
})
export class ReporteComponent {
  formData = {
    startDate: '',
    endDate: '',
    Sede: '',
    collectionSiteId:''
  };
  resultReport: any[] = [];
  listSedes: any = [];
  constructor(
    private _report: ReportsService,
    private _Center: CentersService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._Center.getCollectionSites().subscribe({
      next: (centersResponse: any) => {
        const centers = centersResponse.data.items;
        this.listSedes = centers; // Almacenar los centros
      },
      error: (error: any) => {
        console.error('Error al obtener centros:', error);
      },
    });
  }
  searchfilter(): void {
    const params = {
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
      agencyId: this.formData.collectionSiteId
    };

    console.log('Filtrando con:', params);

    this._report.getReporteReciclajeBaterias(params).subscribe({
      next: (res) => {
        console.log('Reporte:', res.data);
        this.resultReport = res.data;
      },
      error: (err) => {
        console.error('Error al obtener reporte:', err);
      },
    });
  }
  generate(){
      Certificate('');
  }
}
