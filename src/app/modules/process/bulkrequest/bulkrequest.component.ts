import { Component } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';
import { ToastService } from 'src/app/core/services/toast.service';
import * as XLSX from 'xlsx';

declare var bootstrap: any;
@Component({
  selector: 'app-bulkrequest',
  templateUrl: './bulkrequest.component.html',
  styleUrls: ['./bulkrequest.component.css'],
})
export class BulkrequestComponent {
  cardJson = { tab: 'L', Name: 'crear masive' };
  tableData: Array<{
    Nombre: string;
    referenciaWll: string;
    referenciaPh: string;
  }> = [];
  modalConfirm: any;
  modaldetalle: any;
  formattedData: any[] = []; // Variable para almacenar los datos fusionados
  uploadedFile: File | null = null; // Variable para almacenar el archivo cargado
  detailData: any[] = [];
  currentPage: number = 1; // Página actual
  totalPages: number = 0; // Total de páginas
  pageSize: number = 10; // Tamaño de la página (puedes cambiarlo según tus necesidades)
  pagesArray: number[] = []; // Array para las opciones del select
  ListProduct: any;

  constructor(private _general: GeneralService, private _toast: ToastService) {}
  ngOnInit(): void {
    this.modalConfirm = new bootstrap.Modal(
      document.getElementById('modalconfirm'),
      { backdrop: 'static', keyboard: false }
    );

    this.modaldetalle = new bootstrap.Modal(
      document.getElementById('modaldetalle'),
      { backdrop: 'static', keyboard: false }
    );
    this.get(this.currentPage);
  }

 // Método para obtener datos con paginación
//  get(page: number) {
//   this._general.getConsultantsTransp(page).subscribe((response: any) => {
//     console.log(response);
//     this.detailData = response.data.items; // Datos de la tabla
//     this.totalPages = response.data.meta.totalPages; // Total de páginas
//     this.currentPage = page; // Actualizar la página actual
//   });
// }

// // Método para cambiar a la página anterior
// previousPage() {
//   if (this.currentPage > 0) {
//     this.get(this.currentPage - 1);
//   }
// }

// // Método para cambiar a la página siguiente
// nextPage() {
//   console.log(this.currentPage , this.totalPages)
//   if (this.currentPage < this.totalPages ) {
//     this.get(this.currentPage + 1);
//   }
// }

// // Método para ir a una página específica
// goToPage(page: number) {
//   if (page >= 0 && page < this.totalPages) {
//     this.get(page);
//   }
// }
// getPageNumbers(): number[] {
//   const pages: number[] = [];
//   for (let i = 0; i < this.totalPages; i++) {
//     pages.push(i);
//   }
//   return pages;
// }


  // Método para obtener datos con paginación
  get(page: number) {
    this._general.getConsultantsTransp(page).subscribe((response: any) => {
      console.log(response);

      
      this.detailData = response.data.items; // Datos de la tabla
      this.totalPages = response.data.meta.totalPages; // Total de páginas
      this.currentPage = page; // Actualizar la página actual
      this.generatePagesArray(); // Generar el array de páginas para el select
    });
  }

  // Método para generar el array de páginas para el select
  generatePagesArray() {
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Método para cambiar de página desde el select
  onPageChange(event: any) {
    const selectedPage = Number(event.target.value);
    this.get(selectedPage);
  }

  // Método para ir a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.get(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.get(this.currentPage + 1);
    }
  }
  viewData(item: any) {
    this.ListProduct = item;
    this.modaldetalle.show();
  }
  sumQuantity(item: any) {
    return item.reduce(
      (sum: any, product: any) => (sum += Number(product.quantity)),
      0
    );
  }
  // Método para manejar el cambio de archivo
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file; // Guardar el archivo cargado

      // Procesar el archivo
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Procesar ambas hojas
        const principalData: any[] = []; // Datos de la primera hoja
        const detalleData: any[] = []; // Datos de la segunda hoja

        workbook.SheetNames.forEach((sheetName: string) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);

          if (sheetName.toLowerCase() === 'principal') {
            // Procesar la primera hoja
            principalData.push(
              ...jsonData.map((item: any) => {
                let fechaMov = item.fechaMov;
                let horaMov = item.horaMov;

                // Convertir fechaMov
                if (typeof fechaMov === 'number' && !isNaN(fechaMov)) {
                  fechaMov = new Date(1900, 0, fechaMov - 1)
                    .toISOString()
                    .split('T')[0];
                } else {
                  fechaMov = null;
                }

                // Convertir horaMov
                if (typeof horaMov === 'number' && !isNaN(horaMov)) {
                  horaMov = new Date(horaMov * 86400000)
                    .toISOString()
                    .substr(11, 8);
                } else {
                  horaMov = null;
                }

                return {
                  ...item,
                  fechaMov,
                  horaMov,
                };
              })
            );
          } else if (sheetName.toLowerCase() === 'detalle') {
            // Procesar la segunda hoja
            detalleData.push(...jsonData);
          }
        });

        // Fusionar los datos
        const mergedData = principalData.map((principalItem: any) => {
          // Buscar coincidencias en la segunda hoja
          const detalles = detalleData.filter(
            (detalleItem: any) => detalleItem.idGuia === principalItem.idGuia
          );

          // Si hay coincidencias, agregar los detalles al objeto principal
          if (detalles.length > 0) {
            return {
              ...principalItem,
              detalles, // Agregar los detalles como un array
            };
          }

          return principalItem; // Si no hay coincidencias, devolver el objeto principal sin cambios
        });

        // Asignar los datos fusionados a la variable del componente
        this.formattedData = mergedData;
        console.log(this.formattedData); // Verificar el resultado
      };
      reader.readAsArrayBuffer(file);
    }
  }

  // Método para enviar el archivo al backend
  sendFileToBackend(): void {
    if (this.uploadedFile) {
      console.log('Enviando archivo al backend:', this.uploadedFile.name);

      // Ejemplo de cómo enviar el archivo usando FormData y HttpClient
      const formData = new FormData();
      formData.append('file', this.uploadedFile);

      this._general.uploadFile(this.uploadedFile).subscribe(
        (response: any) => {
          console.log('Respuesta del backend:', response);
        },
        (error) => {
          console.error('Error al enviar el archivo:', error);
        }
      );
    } else {
      console.error('No hay archivo cargado para enviar.');
    }
  }
  // Método para recargar la página
  reloadPage(): void {
    window.location.reload();
  }

  editData() {
    this.modalConfirm.show();
  }

  guide: any;
  updateGuide() {
    // Validar que this.guide no sea nulo o indefinido
    if (!this.guide) {
      this._toast.error('ERROR','Error: La guía no puede ser nula o indefinida.');
      return;
    }

    // Realizar la actualización
    this._general.UpdateGuia(this.guide).subscribe(
      (response: any) => {
        // Manejar la respuesta exitosa
        // console.log('Guía actualizada con éxito:', response);
        this._toast.success('Solicitud Enviada','Guía actualizada con éxito');
        // Restablecer el estado de actualización
      },
      (error: any) => {
        // Manejar el error
        this._toast.error('Error al actualizar la guía:', error);

        // Restablecer el estado de actualización
      }
    );
  }
}
