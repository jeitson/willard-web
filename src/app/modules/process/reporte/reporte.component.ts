import { Component } from '@angular/core';
import { GeneralService } from 'src/app/core/services/general.service';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { ProductsService } from 'src/app/core/services/process/products.service';
import { ReportsService } from 'src/app/core/services/process/reports.service';
import { ToastService } from 'src/app/core/services/toast.service';
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
    collectionSiteId: '',
  };
  product: any[] = [];
  type: any;
  resultReport: any[] = [];
  listSedes: any = [];
  constructor(
    private _report: ReportsService,
    private _Center: CentersService,
    private _GeneralService: GeneralService,
    private _toast: ToastService,
    private _ProductsService: ProductsService
  ) {}

  ngOnInit() {
    this.getData();
    this._ProductsService.getProducts().subscribe((respponse: any) => {
      this.product = respponse.data.items;
    });
  }

  getData() {
    this._Center.getCollectionSites().subscribe({
      next: (centersResponse: any) => {
        const centers = centersResponse.data.items;
        this.listSedes = centers;
        this._toast.success('Éxito', 'Centros cargados correctamente.');
      },
      error: (error: any) => {
        console.error('Error al obtener centros:', error);
        this._toast.error('Error', 'No se pudieron cargar los centros.');
      },
    });
  }
  resultReportBase: any[] = [];
  showFilters = false;

  filters = {
    date: '',
    irc: '',
    agency: '',
    thirdPartyNit: '',
    clientName: '',
    clientNit: '',
  };
  // al buscar / cargar datos
  searchfilter(): void {
    const params = {
      startDate: this.formData.startDate,
      endDate: this.formData.endDate,
    };

    if (!params.startDate || !params.endDate) {
      this._toast.info('Info', 'Debe seleccionar las fechas.');
      return;
    }

    this._report.getUploadsByType(this.type, params).subscribe({
      next: (res) => {
        // CLONAR los datos para no mantener referencia
        this.resultReport = Array.isArray(res.data.items)
          ? [...res.data.items]
          : [];
        this.resultReportBase = JSON.parse(JSON.stringify(this.resultReport)); // copia profunda

        // Inicializar filtros (opcional)
        this.clearFilters(false); // false -> no mostrar toast

        if (this.resultReport.length === 0) {
          this._toast.info('Info', 'No se encontraron registros.');
        } else {
          this._toast.success('Éxito', 'Datos cargados correctamente.');
        }
      },
      error: (err) => {
        console.error('Error al obtener reporte:', err);
        this._toast.error('Error', 'No se pudo obtener el reporte.');
      },
    });
  }
  
  filteredResults: any = [];
  selectedItems: number[] = [];

  applyFilters() {
    this.resultReport = this.resultReportBase.filter((item: any) => {
      const matchDate =
        !this.filters.date || item.dateGenerationActa === this.filters.date; // En tu JSON la fecha es dateGenerationActa

      const matchIrc =
        !this.filters.irc ||
        item.ircs?.some((i: string) => i.includes(this.filters.irc));

      const matchAgency =
        !this.filters.agency ||
        item.agency?.toString().includes(this.filters.agency);

      const matchThirdParty =
        !this.filters.thirdPartyNit ||
        item.thirdPartyNit?.toString().includes(this.filters.thirdPartyNit);

      const matchClientName =
        !this.filters.clientName ||
        item.clientName
          ?.toLowerCase()
          .includes(this.filters.clientName.toLowerCase());

      const matchClientNit =
        !this.filters.clientNit ||
        item.clientNit?.toString().includes(this.filters.clientNit);

      return (
        matchDate &&
        matchIrc &&
        matchAgency &&
        matchThirdParty &&
        matchClientName &&
        matchClientNit
      );
    });
  }

  clearFilters(showToast = true) {
    this.filters = {
      date: '',
      irc: '',
      agency: '',
      thirdPartyNit: '',
      clientName: '',
      clientNit: '',
    };
    // restaurar desde la base (copia para evitar referencias)
    this.resultReport = JSON.parse(JSON.stringify(this.resultReportBase || []));
    if (showToast) this._toast.info('Info', 'Filtros limpiados.');
  }

  updateSelection(item: any) {
    if (item.selected) {
      this.selectedItems.push(item.id);
    } else {
      this.selectedItems = this.selectedItems.filter((id) => id !== item.id);
    }

    this._toast.info('Info', `Seleccionados: ${this.selectedItems.length}`);
  }

  toggleAll(event: any) {
    const checked = event.target.checked;
    this.selectedItems = [];

    this.resultReport.forEach((item) => {
      item.selected = checked;
      if (checked) this.selectedItems.push(item.id);
    });

    this._toast.info(
      'Info',
      checked
        ? 'Todos los registros fueron seleccionados.'
        : 'Se ha deseleccionado todo.'
    );
  }

  processCertificates() {
    if (this.selectedItems.length === 0) {
      this._toast.info('Info', 'Seleccione al menos un registro.');
      return;
    }

    // INDIVIDUAL
    if (this.selectedItems.length === 1) {
      const id = this.selectedItems[0];

      this._report.generateCertificateIndividual(id, {}).subscribe({
        next: (resp) => {
          this._toast.success('Éxito', 'Certificado individual generado.');

          // 🔄 REFRESH AUTOMÁTICO
          this.searchfilter();
          this.selectedItems = [];
        },
        error: (err) => {
          console.error(err);
          this._toast.error('Error', 'No se pudo generar el certificado.');
        },
      });
    }

    // GRUPAL
    else {
      const data = { ids: this.selectedItems };

      this._report.generateCertificateGroup(data).subscribe({
        next: (resp) => {
          this._toast.success('Éxito', 'Certificados grupales generados.');

          this.searchfilter();
          this.selectedItems = [];
        },
        error: (err) => {
          console.error(err);
          this._toast.error(
            'Error',
            'No se pudieron generar los certificados grupales.'
          );
        },
      });
    }
  }

  onTypeChange() {
    this.resultReport = [];
    this.selectedItems = [];
    this._toast.info('Info', 'Tipo cambiado, lista limpiada.');
  }

  generate(item: any) {
    this._GeneralService
      .getImageDataUrlFromLocalPath1('/assets/images/firmac.png')
      .subscribe((responseimage: any) => {
        const data = {
          irc: item.ircs,
          agency: item.agency,
        };
        this._report.getCertificateData(data).subscribe({
          next: (response: any) => {
            Certificate(this.product, response.data, responseimage);
            this._toast.success('Éxito', 'Datos del certificado obtenidos.');
          },
          error: (err) => {
            console.error(err);
            this._toast.error(
              'Error',
              'No se pudo obtener la información del certificado.'
            );
          },
        });
      });
  }
}

