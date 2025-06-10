import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ConvenyorService } from 'src/app/core/services/process/convenyor.service';
import { CreditnotesService } from 'src/app/core/services/process/creditnotes.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent {
  constructor(private _Conveyor: ConvenyorService, private _creditnote:CreditnotesService) {}
  // Obtener el listado de transportadores con opción de paginación
  listTransportador: any[] = [];
  creditNotes: any[] = [];

  form = {
    transporter: '',
  };

  ngOnInit(): void {
    this.getTransporter();
  }
  getTransporter() {
    this._Conveyor.getTransportadores().subscribe({
      next: (response: any) => {
        this.listTransportador = response.data.items;
        console.log(this.listTransportador);
      },
      error: (error: any) => {
        console.error('Error al obtener transportadores:', error);
      },
    });
  }

  onTransporterChange(event: any): void {
    const selectedId = event.target.value;
    if (selectedId) {
      this._creditnote.getCreditNotes(selectedId).subscribe({
        next: (res) => {
          console.log('Notas de crédito:', res);
          // Aquí puedes guardar los datos en una variable si los necesitas
          this.creditNotes = res;
        },
        error: (err) => {
          console.error('Error al obtener notas de crédito:', err);
        },
      });
    }
  }
}
