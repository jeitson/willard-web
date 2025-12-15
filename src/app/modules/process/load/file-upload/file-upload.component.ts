import { Component, ViewChild, ElementRef } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ReportsService } from 'src/app/core/services/process/reports.service';
import { ToastService } from 'src/app/core/services/toast.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
type FileType = 'irc' | 'facturas';
type UploadRow = Record<string, any>;

interface UploadItem {
  fileName: string;
  typeLabel: string;
  uploadedAt: Date;
  rowsCount: number;
  user: string;
  parsedRows: UploadRow[];
  columns: string[];
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  constructor(
    private api: ApiService,
    private _Service: ReportsService,
    private _toast: ToastService
  ) {}

  /** 📁 Input del archivo */
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /** 🔄 Estado actual de la vista */
  view: 'main' | 'list' = 'main';
  fileType: FileType = 'irc';

  /** 📋 Vista previa */
  previewData: UploadRow[] = [];
  previewColumns: string[] = [];
  previewFileName = '';
  isSaving = false;
  selectedRowIndex: number | null = null;

  /** 💾 Almacenamiento simulado de cargues */
  uploads: any;

  /** 🏷️ Etiqueta legible según tipo */
  get currentLabel(): string {
    return this.fileType === 'irc' ? 'Cargue IRC' : 'Cargue Facturas';
  }

  // ======================================================
  // 🔹 Navegación
  // ======================================================
 // VARIABLES
currentPage = 1;
itemsPerPage = 10;
totalPages = 1;
order: 'ASC' | 'DESC' = 'ASC';

// Getter para crear el array de páginas
get pages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

// Abrir lista con paginación
openList(type: FileType, page: number = 1): void {
  this.fileType = type;
  this.currentPage = page;
  this.view = 'list';
  this.resetPreview();

  // asegúrate de usar números (no strings) en los params
  const params = {
    page: this.currentPage,
    pageSize: this.itemsPerPage,
    order: this.order
  };

  // Llamada al servicio — espera que getAllUploads acepte un objeto params
  this._Service.getAllUploads(params).subscribe({
    next: (response: any) => {
      // debug útil

      const uploads = (response?.data?.items) ?? response ?? [];

      // Actualizar paginación desde la API si existe
      const meta = response?.data?.meta;
      if (meta) {
        this.currentPage = meta.currentPage ?? this.currentPage;
        this.itemsPerPage = meta.itemsPerPage ?? this.itemsPerPage;
        this.totalPages = meta.totalPages ?? this.totalPages;
      } else {
        // Si la API no devuelve meta, hacer paginación cliente simple
        this.totalPages = Math.max(1, Math.ceil(uploads.length / this.itemsPerPage));
      }


      // Filtrado por tipo
      this.uploads = uploads.filter((item: any) => {
        if (this.fileType === 'irc') return item.uploadType === 'IRC';
        if (this.fileType === 'facturas') return item.uploadType === 'FACTURA';
        return false;
      });
    },
    error: (err) => {
      console.error('Error obteniendo uploads', err);
      // maneja el error como prefieras (toast, fallback, etc.)
      this.uploads = [];
      this.totalPages = 1;
    }
  });
}

// CAMBIO DE PÁGINA
changePage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.openList(this.fileType, page);
}

  goBack(): void {
    this.view = 'main';
    this.resetPreview();
  }
  selectedFile!: File | null;

  // ======================================================
  // 🔹 Carga y Lectura de Archivos
  // ======================================================
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file; // ⬅️ GUARDAR ARCHIVO PARA ENVIAR AL BACKEND
    this.resetPreview();
    this.previewFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
 const workbook = XLSX.read(e.target.result, {
  type: 'array',
  cellDates: true
});

const sheet = workbook.Sheets[workbook.SheetNames[0]];

const json = XLSX.utils.sheet_to_json<UploadRow>(sheet, {
  defval: '',
  raw: false,
  dateNF: 'yyyy-mm-dd'
});

        //
        if (!json.length) throw new Error('Archivo vacío');

        this.previewData = this.normalizeKeys(json);
        this.previewColumns = Object.keys(this.previewData[0]);
      } catch (err) {
        this._toast.warning('Error', '❌ No se pudo leer el archivo Excel.');
        this.resetPreview();
      }
    };

    reader.readAsArrayBuffer(file);
    input.value = '';
  }

  /** 🧹 Limpia la vista previa */
  resetPreview(): void {
    this.uploads = [];
    this.isSaving = false;
    this.previewData = [];
    this.previewColumns = [];
    this.previewFileName = '';
    this.selectedRowIndex = null;
  }

  /** ✨ Normaliza los encabezados de las columnas */
  private normalizeKeys(data: UploadRow[]): UploadRow[] {
    return data.map((row) => {
      const normalized: UploadRow = {};
      for (const key of Object.keys(row)) {
        normalized[key.trim()] = row[key];
      }
      return normalized;
    });
  }
  buildJsonPayload() {
    if (!this.previewData.length) return null;

    let records: any = [];

    if (this.fileType === 'irc') {
      records = this.previewData.map((row) => ({
        Agencia: row['Agencia'],
        IRC: row['IRC'],
        Fecha: this.toDate(row['Fecha']),
        NitCliente: row['NitCliente'],
        Cliente: row['Cliente'],
        NitTercero: row['NitTercero'] || '-',
        NombreTercero: row['NombreTercero'] || '-',
        Referencia: row['Referencia'],
        Cantidad: Number(row['Cantidad']) || 0,
        ERC: row['ERC'] || '', // Excel NO lo trae, lo mandamos vacío
        Remision: row['Remision'] || '', // Excel NO lo trae
      }));
    }

    if (this.fileType === 'facturas') {
      records = this.previewData.map((row) => ({
        FechaFactura: this.toDate(row['FechaFactura']),
        Factura: Number(row['Factura']) || 0,
        Referencia: row['Referencia'],
        Cantidad: Number(row['Cantidad']) || 0,
        Total: Number(row['Total']) || 0,
        Agencia: row['Agencia'],
        ERC: row['ERC'],
        Remision: row['Remision'],
        FechaRemision: this.toDate(row['FechaRemision']),
      }));
    }

    return { records };
  }

  /** Normaliza fechas YYYY-MM-DD de forma segura */
  private toDate(val: any): string {
    if (!val) return '';

    return val.split('/').reverse().join('-');
  }

  // ======================================================
  // 🔹 Guardar y Gestionar Cargues
  // ======================================================
  // saveUpload(): void {
  //   if (!this.previewData.length) {
  //     this._toast.warning('Error', '⚠️ No hay datos para guardar.');
  //     return;
  //   }

  //   const payload = this.buildJsonPayload();
  //   if (!payload) {
  //     this._toast.warning('Error', '❌ No se pudo crear el JSON.');
  //     return;
  //   }

  //   this.isSaving = true;

  //   let request$ =
  //     this.fileType === 'irc'
  //       ? this._Service.postCargueIRCJson(payload)
  //       : this._Service.postCargueFacturasJson(payload);

  //   request$
  //     .pipe(
  //       finalize(() => {
  //         // SIEMPRE se ejecuta
  //         this.isSaving = false;
  //       })
  //     )
  //     .subscribe({
  //       next: () => {
  //         const newItem: UploadItem = {
  //           fileName: this.previewFileName,
  //           typeLabel: this.fileType === 'irc' ? 'IRC' : 'Facturas',
  //           uploadedAt: new Date(),
  //           rowsCount: this.previewData.length,
  //           user: 'admin',
  //           parsedRows: this.previewData,
  //           columns: this.previewColumns,
  //         };

  //         this.openList(this.fileType);
  //         this.resetPreview();
  //         this._toast.success('Enviado', '✅ JSON enviado correctamente.');
  //       },
  //       error: () => {
  //         this._toast.warning('Error', '❌ Error enviando los datos.');
  //       },
  //     });
  // }

  saveUpload(): void {
    if (!this.selectedFile) {
      this._toast.warning('Error', '⚠️ No hay archivo seleccionado.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile); // ⬅️ AQUÍ MANDAS EL ARCHIVO

    this.isSaving = true;

    let request$ =
      this.fileType === 'irc'
        ? this._Service.postCargueIRCExcel(formData)
        : this._Service.postCargueFacturasExcel(formData);

    request$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => {
        const newItem: UploadItem = {
          fileName: this.previewFileName,
          typeLabel: this.fileType === 'irc' ? 'IRC' : 'Facturas',
          uploadedAt: new Date(),
          rowsCount: this.previewData.length,
          user: 'admin',
          parsedRows: this.previewData,
          columns: this.previewColumns,
        };

        this.openList(this.fileType);
        this.resetPreview();
        this._toast.success('Enviado', '✅ Archivo enviado correctamente.');
      },
      error: () => {
        this._toast.warning('Error', '❌ Error enviando el archivo.');
      },
    });
  }

  // viewUpload(index: number): void {
  //   const item = this.uploads[this.fileType][index];
  //   if (!item) return;

  //   if (!item.parsedRows?.length) {
  //     this._toast.info(
  //       'Validar',
  //       'ℹ️ No hay detalles disponibles para previsualizar este cargue.'
  //     );

  //     return;
  //   }

  //   this.previewData = item.parsedRows;
  //   this.previewColumns = item.columns;
  //   this.previewFileName = item.fileName;
  //   this.selectedRowIndex = index;
  // }

  deleteUpload(index: any): void {
    Swal.fire({
      title: '¿Eliminar este cargue?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4',
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-secondary',
      },
      buttonsStyling: false,
    }).then((result) => {
      if (!result.isConfirmed) return;

      this._Service.getDelete(index.id).subscribe({
        next: (response: any) => {
          // Si tu API devuelve status 200 o un campo success
          this.openList(this.fileType);
          Swal.fire({
            title: 'Eliminado',
            text: 'El cargue fue eliminado correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'rounded-4',
              confirmButton: 'btn btn-primary',
            },
            buttonsStyling: false,
          });
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un problema al eliminar.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            customClass: {
              popup: 'rounded-4',
              confirmButton: 'btn btn-danger',
            },
            buttonsStyling: false,
          });
        },
      });
    });
  }
}
