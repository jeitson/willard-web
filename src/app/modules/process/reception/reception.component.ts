import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { CentersService } from 'src/app/core/services/process/centers.service';
import { ToastService } from 'src/app/core/services/toast.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css'],
})
export class ReceptionComponent implements OnInit {
  @ViewChild('video', { static: false })
  videoElement!: ElementRef<HTMLVideoElement>;
  p: number = 1;
  totalItemsRender: number = 10;
  pagination: any = {};
  receptionForm = {
    transporterId: '',
    licensePlate: '',
    collectionSiteId: '',
    recuperadoraId: '',
    driver: '',
    routeId: '',
    referenceDoc1: '',
    referenceDoc2: '',
  };
  listTransporters: any[] = [];
  photos: any[] = [];
  listTypeProducts: any[] = [];
  listProducts: any[] = [];
  listReceptions: any[] = [];
  listBase: any[] = [];
  listCollections: any[] = [];
  products: any[] = [];
  product: any = {
    productId: '',
    quantity: '',
  };
  actionmodal: any = {
    icon: '',
    name: '',
    value: '',
    color: '',
  };
  searchTerm$ = new Subject<any>();
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  modal: any;
  modalloading: any;
  modalconfirmGuide: any;
  activeSection: string | null = null;
  editpanel = false;
  action = '';
  showCamera: boolean = false;
  photo: string | null = null;
  videoStream: MediaStream | null = null;
  imageselect: any = {};
  reception: any = {};
  messageLoading = 'Subiendo Archivos, por favor espera...';
  jsonData: any[] = [];
  // paginacion
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  totalItems = 0;
  paginatedList: any = [];
  role: string = '';
  headacopi: any = '';
  modalConfirm: any;
  modalconfirmDetail: any;
  guide: string = '';
  receptionDetail: any;
  isAdmin = false;
  agencias: any[] = [];
  recuperadoras: any[] = [];
  constructor(
    private api: ApiService,
    private _Service: CentersService,
    private _toast: ToastService
  ) {}

  ngOnInit() {
    this.role = sessionStorage.getItem('RoleId') || '';

    this.modal = new bootstrap.Modal(document.getElementById('modalevidence'), {
      backdrop: 'static',
      keyboard: false,
    });
    this.modalloading = new bootstrap.Modal(
      document.getElementById('modalLoading'),
      { backdrop: 'static', keyboard: false }
    );
    this.modalconfirmGuide = new bootstrap.Modal(
      document.getElementById('modalconfirmGuide'),
      { backdrop: 'static', keyboard: false }
    );
    this.modalconfirmDetail = new bootstrap.Modal(
      document.getElementById('modalconfirmDetail'),
      { backdrop: 'static', keyboard: false }
    );

    this.getReceptions(this.currentPage);
    this.getTransporters();
    this.getProductType();
    this.getProducts();
    this.listCollectionSite();
  }

  getReceptions(item: any) {
    this.api.get(`receptions?page=${item}`).subscribe({
      next: (response: any) => {
        this.listReceptions = response.data.items.sort(
          (a: any, b: any) => b.id - a.id
        );
        this.listBase = this.listReceptions; // Guardamos la lista original para filtrar
        this.totalItems = this.listReceptions.length; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de páginas
        this.search();
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  getProductType() {
    this.api.get(`products/categories`).subscribe({
      next: (response: any) => {
        this.listTypeProducts = response.data;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  listCollectionSite() {
    this._Service.getCollectionSites().subscribe({
      next: (response: any) => {
        this.listCollections = response.data.items;
        this.agencias = this.listCollections.filter(
          (c) => String(c.siteTypeId).trim() === '49'
        );
        this.recuperadoras = this.listCollections.filter(
          (c) => String(c.siteTypeId).trim() === '48'
        );
      },
      error: (error: any) => {
        console.error('Error al obtener centros de recolección:', error);
      },
    });
  }

  viewDetail(item: any) {
    this.receptionDetail = item;
    this.modalconfirmDetail.show();
  }

  getProducts() {
    this.api.get(`products`).subscribe({
      next: (response: any) => {
        this.listProducts = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  getTransporters(): void {
    this.api.get('transporters').subscribe({
      next: (response: any) => {
        this.listTransporters = response.data.items;
      },
      error: (error: any) => {
        console.error('Error al obtener transportadores:', error);
      },
    });
  }

  filterProductBytype(id: string, products: any[]) {
    const productlist = products.filter((x: any) => x.productTypeId === id);
    return productlist;
  }

  addReception(): void {
    // Reiniciar fotos y cantidades
    this.photos = [];
    this.products.forEach((product) => (product.quantity = 0));

    // Reiniciar formulario
    this.receptionForm = {
      transporterId: '',
      licensePlate: '',
      collectionSiteId: '',
      recuperadoraId: '',
      driver: '',
      routeId: '',
      referenceDoc1: '',
      referenceDoc2: '',
    };

    // Obtener datos del perfil del sessionStorage
    const profileDataRaw = sessionStorage.getItem('profileData');
    const profileData = profileDataRaw ? JSON.parse(profileDataRaw) : {};

    // Asignar sitio de acopio si existe
    const userSites = profileData.userCollectionSites;
    if (Array.isArray(userSites) && userSites.length > 0) {
      const site = userSites[0];
      const siteName = site?.collectionSite?.name;
      const siteId = site?.collectionSiteId;

      if (siteName && siteId) {
        this.headacopi = siteName;
        this.receptionForm.collectionSiteId = siteId;
      } else {
        console.warn('El sitio de acopio o su nombre están indefinidos');
        this.isAdmin = true;
      }
    } else {
      this.isAdmin = true;
    }

    // Mostrar primer tipo de producto
    if (this.listTypeProducts.length > 0) {
      this.toggleSection(this.listTypeProducts[0].id || '');
    }

    // Activar panel de edición
    this.editpanel = true;
    this.action = 'agregar';
  }

  editReception(item: any) {
    this.reception = item;
    this.modalconfirmGuide.show();
    this.guide = item.routeId;
  }

  updateGuide() {
    if (this.guide === '' || this.guide === this.reception.routeId) {
      this._toast.warning(
        'Error',
        'El número de guía que quiere actualizar no puede estar vacío o ser igual al actual.'
      );
      return;
    }
    this.api
      .put(`receptions/${this.reception.id}`, { routeId: this.guide })
      .subscribe({
        next: (response: any) => {
          this.modalconfirmGuide.hide();
          this._toast.success('Completado', 'Guía actualizada correctamente');
          this.getReceptions(this.currentPage);
        },
        error: (error: any) => {
          console.error('Error al actualizar el id de guia');
        },
      });
  }

  toggleSection(section: string) {
    if (this.activeSection === section) {
      // Si ya está activa, la cierra
      this.activeSection = null;
    } else {
      // Si no, la abre y cierra las demás
      this.activeSection = section;
    }
  }

  countQuantity(categoryId: number) {
    // return this.listProducts.filter(product => product.productTypeId === type)
    // .reduce((sum, product) => sum + product.quantity, 0);
    // Busca la categoría en el listado de categorías
    const category = this.listTypeProducts.find(
      (typep) => typep.id === categoryId
    );

    // Si no encuentra la categoría, retorna 0
    if (!category || !category.products) {
      return 0;
    }

    // Suma las cantidades de los productos
    const totalQuantity = category.products.reduce((sum: any, product: any) => {
      // Asegúrate de que la cantidad sea un número válido
      const quantity = Number(product.quantity) || 0;
      return sum + quantity;
    }, 0);

    return totalQuantity;
  }

  sumQuantity(item: any) {
    return item.reduce(
      (sum: any, product: any) => (sum += Number(product.quantity)),
      0
    );
  }

  addProduct(productTypeId: number) {
    const exist = this.products.find(
      (x: any) => x.productId === this.product.productId
    );
    if (exist === undefined) {
      this.products.push({ ...this.product, productTypeId });
      this.product = {
        productId: '',
        quantity: '',
      };
    } else {
      this._toast.warning(
        'Error',
        'Ya existe una cantidad agregada para este producto'
      );
    }
  }

  deleteProduct(item: any) {
    this.products = this.products.filter(
      (x: any) => x.productId !== item.productId
    );
  }

  getNamePropuct(id: number) {
    return this.listProducts.find((x: any) => x.id === id).name;
  }

  getNameTransporter(id: string) {
    return this.listTransporters.find((x: any) => x.id === id)?.name || '';
  }

  // Abre la cámara y muestra el stream
  openCamera() {
    if (this.photos.length === 6) {
      this._toast.info('Importante', 'Se permiten maximo 6 soportes adjuntos');
      return;
    }
    this.showCamera = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        this.videoStream = stream;
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
        this.showCamera = false;
      });
  }

  // Cierra la cámara y detiene el stream
  closeCamera() {
    this.showCamera = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = null;
    }
  }

  // Captura la foto del video
  capturePhoto() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.photo = canvas.toDataURL('image/png'); // Convierte la imagen en base64
      this.photos.push({ url: this.photo, id: new Date().getTime() });
    }

    this.closeCamera(); // Opcional: cerrar la cámara después de capturar la foto
  }

  openGallery() {
    if (this.photos.length === 6) {
      this._toast.info('Importante', 'Se permiten maximo 6 soportes adjuntos');
      return;
    }
    const cameraInput = document.getElementById(
      'cameraInput'
    ) as HTMLInputElement;
    cameraInput.click(); // Simula el click sobre el input para abrir la cámara
  }

  showTable = false; // controla la visibilidad de la tabla
  excelData: any[] = []; // guarda los datos de la hoja "Detalle"
  headers: string[] = []; // guarda los encabezados de las columnas

  // Evento al seleccionar archivo
  onFileSelectedExcel(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.excelToJson(file)
        .then((data) => {
          this.jsonData = data;
          console.log(this.jsonData);
          this.showTable = true;
          console.log('✅ JSON result:', this.jsonData);
        })
        .catch((err) => {
          console.error('❌ Error leyendo Excel:', err);
        });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Al completar la lectura del archivo, obtén el base64
      reader.onload = (e: any) => {
        const base64String = e.target.result; // El resultado será el base64
        this.photos.push({ url: base64String, id: new Date().getTime() }); // Puedes almacenarlo en el array 'photos' o usarlo como necesites
      };

      // Lee el archivo como una URL en base64
      reader.readAsDataURL(file);
    }
  }

  excelToJson(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const data: Uint8Array = new Uint8Array(e.target.result);
          const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'array' });

          // Leer la hoja "Detalle"
          const sheetName: string = 'Detalle';
          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

          // Convertir a JSON
          const records: any[] = XLSX.utils.sheet_to_json(worksheet, {
            defval: null,
          });
          resolve(records);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);

      reader.readAsArrayBuffer(file);
    });
  }

  modalOpen = false;
  closeModal(): void {
    this.modalOpen = false;
  }
  selectedRow: any = null;
  openModal(row: any) {
    console.log(row);
    this.selectedRow = row;
    const modal = new bootstrap.Modal(document.getElementById('detalleModal'));
    modal.show();
  }

  // 48 = recuperadora 49 = agencia
  downloadExcel(): void {
    const headers = [
      'FechaRecepcion',
      'RutaId',
      'AgenciaPh',
      'Recuperadora',
      'Transportador',
      'PlacaVehiculo',
      'Conductor',
      '21-30H',
      '22-48',
      '23-4D',
      '24-8D',
      '16-22',
      '17-24',
      '18-27',
      '10-GRUPO24',
      '7-GRUPO27',
      '6-GRUPO31',
      '12-GRUPO35',
      '8-GRUPO34',
      '13-GRUPO51y51R',
      '14-GRUPO65',
      '15-GRUPO78',
      '20-ESTACIONARIAS',
      '19-MOTOS',
    ];

    const transportadores = [...this.listTransporters];

    Swal.fire({
      title: 'Seleccionar',
      html: `
      <div style="display:flex; flex-direction:column; gap:6px; font-size:13px; text-align:left; min-width:250px;">
        
        <!-- Transportador -->
        <div>
          <label for="swal-transportador" style="display:block; margin-bottom:2px;">Transportador:</label>
          <select id="swal-transportador" class="swal2-select"
            style="width:80%; padding:2px 2px; font-size:13px; border-radius:4px;">
            ${transportadores
              .map((t) => `<option value="${t.id}">${t.name}</option>`)
              .join('')}
          </select>
        </div>

        <!-- Agencia -->
        <div>
          <label for="swal-agencia" style="display:block; margin-bottom:2px;">Agencia:</label>
          <select id="swal-agencia" class="swal2-select"
            style="width:80%; padding:2px 2px; font-size:13px; border-radius:4px;">
            ${this.agencias
              .map((a) => `<option value="${a.id}">${a.name}</option>`)
              .join('')}
          </select>
        </div>

        <!-- Recuperadora -->
        <div>
          <label for="swal-recuperadora" style="display:block; margin-bottom:2px;">Recuperadora:</label>
          <select id="swal-recuperadora" class="swal2-select"
            style="width:80%; padding:2px 2px; font-size:13px; border-radius:4px;">
            ${this.recuperadoras
              .map((r) => `<option value="${r.id}">${r.name}</option>`)
              .join('')}
          </select>
        </div>

      </div>
    `,
      showCancelButton: true,
      confirmButtonText: 'Generar Excel',
      preConfirm: () => {
        const transportadorId = (
          document.getElementById('swal-transportador') as HTMLSelectElement
        ).value;

        const agenciaId = (
          document.getElementById('swal-agencia') as HTMLSelectElement
        ).value;

        const recuperadoraId = (
          document.getElementById('swal-recuperadora') as HTMLSelectElement
        ).value;

        return { transportadorId, agenciaId, recuperadoraId };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const transportador = this.listTransporters.find(
          (t) => t.id === result.value.transportadorId
        );

        const agencia = this.agencias.find(
          (a) => a.id === result.value.agenciaId
        );

        const recuperadora = this.recuperadoras.find(
          (r) => r.id === result.value.recuperadoraId
        );

        // Fila inicial
        const row1 = [
          '1/08/2025', // FechaRecepcion
          '6070', // RutaId
          `${agencia?.id || ''} `, // ⭐ AgenciaPh
          `${recuperadora?.id || ''} `, // ⭐ Recuperadora
          `${transportador?.id || ''} `, // Transportador
          'HHW-666', // Placa
          'MARCOS PINTO', // Conductor
          0,
          1,
          3,
          6,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0, // demás columnas
        ];

        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
          headers,
          row1,
        ]);

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalle');

        XLSX.writeFile(workbook, 'estructura_productos.xlsx');
      }
    });
  }

  ProccessBase() {
    const result = this.transformData(this.jsonData);
    console.log(result);

    Swal.fire({
      title: 'Procesando...',
      text: 'Por favor espere un momento',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.api.post(`receptions`, { ...result }).subscribe({
      next: (response: any) => {
        Swal.close(); // cerramos el loading
        Swal.fire({
          icon: 'success',
          title: 'Proceso completado',
          text: 'La base se procesó correctamente',
          timer: 2500,
          showConfirmButton: false,
        });

        this.getReceptions(this.currentPage);
        this.modalloading.hide();
        this.editpanel = false;
      },
      error: (error: any) => {
        Swal.close(); // cerramos el loading
        Swal.fire({
          icon: 'error',
          title: 'Error al procesar',
          text: error?.message || 'Hubo un problema al guardar la recepción',
        });

        this.modalloading.hide();
        console.error('Error al guardar la recepción:', error);
      },
    });
  }
  transformData(jsonData: any[]) {
    console.log(jsonData);
    // definimos los campos que corresponden a productos
    const productFields = [
      '21-30H',
      '22-48',
      '23-4D',
      '24-8D',
      '16-22',
      '17-24',
      '18-27',
      '10-GRUPO24',
      '7-GRUPO27',
      '6-GRUPO31',
      '12-GRUPO35',
      '8-GRUPO34',
      '13-GRUPO51y51R',
      '14-GRUPO65',
      '15-GRUPO78',
      '20-ESTACIONARIAS',
      '19-MOTOS',
    ];

    return {
      receptions: jsonData.map((item) => ({
        routeId: item.RutaId,
        transporterId: Number(item.Transportador), // lo mando como número
        agencyId: Number(item.AgenciaPh), // lo mando como número
        licensePlate: item.PlacaVehiculo,
        recuperatorId: Number(item.Recuperadora),
        driver: item.Conductor,
        referenceDoc1: '',
        referenceDoc2: '',
        photos: [], // aquí luego puedes meter los objetos { url }
        details: productFields
          .map((field) => ({
            productId: field.split('-')[0],
            quantity: item[field] ?? 0,
          }))
          .filter((d) => d.quantity > 0), // 🔥 Solo productos con cantidad > 0
      })),
    };
  }

  viewPhoto(item: any) {
    this.imageselect = item;
    this.modal.show();
  }

  deleteEvidence(item: any) {
    this.photos = this.photos.filter((x: any) => x.id !== item.id);
    this.modal.hide();
  }

  cancelReception() {
    this.editpanel = false;
    this.showTable = false;
    this.action = 'listar';
    this.getReceptions(this.currentPage);
  }

  base64ToBlob(base64: string, contentType = ''): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = Array.from(slice, (char) => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: contentType });
  }

  confirmReception() {
    if (this.photos.length === 0) {
      this._toast.info(
        'Importante',
        'Debe adjuntar evidencias para la recepción'
      );
      return;
    }
    this.products = this.listTypeProducts
      .flatMap((element) => element.products)
      .reduce((acc, { id, quantity }) => {
        if (quantity > 0) {
          acc.push({ productId: id, quantity });
        }
        return acc;
      }, []);
    if (this.products.length === 0) {
      this._toast.info(
        'Importante',
        'Debe indicar la cantidad de almenos un producto para la recepción'
      );
      return;
    }
    this.actionmodal.name = 'Confirmar Envio';
    this.actionmodal.value = 'saveshipping';
    this.actionmodal.color = '#198754';
    this.actionmodal.icon = 'fa-solid fa-check';
    this.modalConfirm = new bootstrap.Modal(
      document.getElementById('modalconfirm'),
      { backdrop: 'static', keyboard: false }
    );
    this.modalConfirm.show();
  }

  uploadEvidence() {
    this.modalConfirm.hide();
    this.modalloading.show();
    const formData = new FormData();
    this.photos
      .map((item) => ({
        url: item.url.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
      }))
      .forEach((base64String, index) => {
        // Aquí asumimos que son imágenes, puedes cambiar el 'image/png' según el tipo de archivo
        const blob = this.base64ToBlob(base64String.url, 'image/png');
        // Adjunta el blob al FormData, nombrando cada archivo con un índice u otro identificador
        formData.append(`file${index}`, blob, `image${index}.png`);
      });

    this.api.postWithReturnData(`files/upload`, formData).subscribe({
      next: (response: any) => {
        this.messageLoading = 'Recepcionando productos, por favor espera...';
        this.saveReception(response);
      },
      error: (error: any) => {
        this.modalloading.hide();
        console.error('Error al subir archivos:', error);
      },
    });
  }

  saveReception(photos: any[]) {
    const reception = {
      routeId: this.receptionForm.routeId,
      transporterId: this.receptionForm.transporterId,
      agencyId: this.receptionForm.collectionSiteId,
      licensePlate: this.receptionForm.licensePlate.toUpperCase(),
      recuperatorId: this.receptionForm.recuperadoraId,
      driver: this.receptionForm.driver,
      referenceDoc1: this.receptionForm.referenceDoc1,
      referenceDoc2: this.receptionForm.referenceDoc1,
      photos: photos,
      details: this.products,
    };

    const data = {
      receptions: [reception],
    };

    console.log(data);
    this.api.post(`receptions`, data).subscribe({
      next: (response: any) => {
        this.editpanel = false;
        this.action = 'listar';
        this.getReceptions(this.currentPage);
        this.modalloading.hide();
      },
      error: (error: any) => {
        this.modalloading.hide();
        console.error('Error al guardar la recepción:', error);
      },
    });
  }

  // paginación
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listReceptions.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
      this.getReceptions(page);
    }
  }

  onPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPage = Number(selectElement.value);
    this.goToPage(selectedPage);
  }

  get pagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  search(): void {
    this.searchTerm$.subscribe(({ value }: { value: string }) => {
      this.listReceptions = this.listBase.filter((item) => {
        const itemValues = Object.values(item);
        return itemValues.some((item) =>
          String(item).toLowerCase().includes(value.toLowerCase())
        );
      });
    });
  }
}
