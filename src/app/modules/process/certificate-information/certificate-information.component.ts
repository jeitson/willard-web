import { Component } from '@angular/core';
import { ReportsService } from 'src/app/core/services/process/reports.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-certificate-information',
  templateUrl: './certificate-information.component.html',
  styleUrls: ['./certificate-information.component.css']
})
export class CertificateInformationComponent {
  selectedFile: File | null = null;
  records: any[] = [];

  // Lista de columnas requeridas
  requiredHeaders = ['CODAGE', 'IRC', 'F_IRC', 'NITCLI', 'NOMCLI', 'NITTERC', 'NOMTERC', 'FAMBAT', 'CANT'];


   constructor(
      private _report: ReportsService,
    ) {}

    currentTab = 'upload'; // inicial por defecto

savedRecords: any[] = [];
 ngOnInit() {
    this.getSavedRecords();
  }

pagination = {
  currentPage: 1,
  itemsPerPage: 20,
  totalPages: 1
};
get visiblePages(): number[] {
  const total = this.pagination.totalPages;
  const current = this.pagination.currentPage;
  const delta = 2; // Número de páginas antes y después de la actual
  const range = [];

  let start = Math.max(2, current - delta);
  let end = Math.min(total - 1, current + delta);

  if (current - delta <= 2) {
    end = 5;
    start = 2;
  }

  if (current + delta >= total - 1) {
    start = total - 4;
    end = total - 1;
  }

  start = Math.max(start, 2);
  end = Math.min(end, total - 1);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
}


getSavedRecords(page: number = 1) {
  this._report.getInformationCertificates({ page }).subscribe({
    next: (res) => {
      this.savedRecords = res.data.items;
      this.pagination = {
        currentPage: res.data.meta.currentPage,
        itemsPerPage: res.data.meta.itemsPerPage,
        totalPages: res.data.meta.totalPages
      };
    },
    error: () => {
      this.savedRecords = [];
    }
  });
}

  onFileChange(event: any): void {
    const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
  }

  uploadExcel(): void {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      if (!jsonData || jsonData.length === 0) {
        alert('El archivo está vacío');
        return;
      }

      const fileHeaders = Object.keys(jsonData[0]);

      const allHeadersPresent = this.requiredHeaders.every(header =>
        fileHeaders.includes(header)
      );

      if (!allHeadersPresent) {
        alert('❌ Las cabeceras del archivo no coinciden con las requeridas:\n' + this.requiredHeaders.join(', '));
        return;
      }

      this.records = jsonData;
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }
sendFile() {
  console.log(this.selectedFile);
  if (!this.selectedFile) return;

  const formData = new FormData();
  formData.append('file', this.selectedFile);
    console.log('aqui fue');
  this._report.postInformationCertificates(formData).subscribe((resp: any)=>{
    console.log(resp);
  })

}

  reload(): void {
    this.records = [];
  }

}
