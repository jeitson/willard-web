import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-bulkrequest',
  templateUrl: './bulkrequest.component.html',
  styleUrls: ['./bulkrequest.component.css']
})
export class BulkrequestComponent {

  cardJson = {tab:'L', Name: 'crear masive'}
  tableData: Array<{ Nombre: string; referenciaWll: string; referenciaPh: string }> = [];
  tableDataa = [
    {
      Nombre: 'Archivo 1',
      fechaCreacion: '2024-11-01',
      fechaActualizacion: '2024-11-10',
      estado: 'Activo',
      referenciaWll: 'WLL123',
      referenciaPh: 'PH456'
    },
    {
      Nombre: 'Archivo 2',
      fechaCreacion: '2024-10-25',
      fechaActualizacion: '2024-10-30',
      estado: 'Inactivo',
      referenciaWll: 'WLL789',
      referenciaPh: 'PH012'
    },
    {
      Nombre: 'Archivo 3',
      fechaCreacion: '2024-09-15',
      fechaActualizacion: '2024-09-20',
      estado: 'Activo',
      referenciaWll: 'WLL345',
      referenciaPh: 'PH678'
    }
  ];
  
  // Método para manejar el cambio de archivo
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Asumiendo que los datos están en la primera hoja
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        // Mapear los datos a las columnas necesarias
        this.tableData = jsonData.map((row: any) => ({
          Nombre: row.Nombre || '',
          referenciaWll: row.referenciaWll || '',
          referenciaPh: row.referenciaPh || '',
        }));
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Método para recargar la página
  reloadPage(): void {
    window.location.reload();
  }

}
