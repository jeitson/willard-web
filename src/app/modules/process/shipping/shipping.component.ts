import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ToastService } from 'src/app/core/services/toast.service';

declare var bootstrap: any;
@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit {

  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  p:number = 1;
  totalItemsRender: number = 10;
  pagination: any = {};
  shipmentForm = {
    transporterId:'',
    licensePlate:'',
    erc: [] as string[],
    driver:'',
    guideNumber:'',
    referenceDoc1:'',
    referenceDoc2:'',
  }
  listTransporters: any[] = [];
  photos: any[] = [];
  listTypeProducts: any[] = [];
  listProducts: any[] = [];
  listShipping: any[] = [];
  listBase: any[] = [];

  products: any[] = [];
  product: any = {
    productId:'',
    quantity:''
  }
  searchTerm$ = new Subject<any>();
  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  modal: any;
  modalloading: any;
  activeSection: string | null = null;
  editpanel = false;
  action = '';
  showCamera: boolean = false;
  photo: string | null = null;
  videoStream: MediaStream | null = null;
  imageselect:any = {};
  messageLoading = 'Subiendo Archivos, por favor espera...';
  erc: string = '';

  // paginacion
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  totalItems = 0;
  paginatedList: any = [];
  role: string = '';
  headacopi: any = '';
  constructor(private api: ApiService, private _toast: ToastService){}

  ngOnInit(){
    this.role = sessionStorage.getItem('RoleId') || '';
    const head = JSON.parse(sessionStorage.getItem('profileData') || '[]');
    if(head?.collectionSites.length > 0){
      this.headacopi = head?.collectionSites[0].collectionSite.name
    } else {
      this.headacopi = this.role;
    }
    this.modal = new bootstrap.Modal(document.getElementById('modalevidence'), {backdrop: 'static', keyboard: false});
    this.modalloading = new bootstrap.Modal(document.getElementById('modalLoading'), {backdrop: 'static', keyboard: false});
    this.getShipments(this.currentPage);
    this.getTransporters();
    this.getProductType();
    this.getProducts();
  }

  getShipments(item: any){
    this.api.get(`shipments?page=${item}`).subscribe({
      next: (response: any) => {
        this.listShipping = response.data.items;
        this.listBase = this.listShipping; // Guardamos la lista original para filtrar
        this.totalItems = this.listShipping.length; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de páginas
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  getProductType(){
    this.api.get(`catalogs/key/TIPO_PRODUCTO`).subscribe({
      next: (response: any) => {
        this.listTypeProducts = response.data;
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  getProducts(){
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

  filterProductBytype(id: string, products: any[]){
    const productlist = products.filter((x:any)=>x.productTypeId === id);
    return productlist;
  }

  addShipments(){
    this.photos = [];
    this.products.forEach(element => {
      return element.quantity = 0;
    });
    this.shipmentForm = {
      transporterId:'',
      licensePlate:'',
      driver:'',
      erc: [] as string[],
      guideNumber:'',
      referenceDoc1:'',
      referenceDoc2:'',
    }
    this.toggleSection(this.listTypeProducts[0].id || '');
    this.editpanel = true;
    this.action = 'agregar'
  }

  editShipments(item: any){
    this.editpanel = true;
    this.action = 'actualizar'
  }

  addErc(){
    if(this.erc !== ''){
      const exist =  this.shipmentForm.erc.find((x: any)=> x === this.erc);
      if(exist === undefined){
        this.shipmentForm.erc.push(this.erc);
        this.erc = '';
      }
    }
  }

  removeErc(item: any){
      this.shipmentForm.erc =  this.shipmentForm.erc.filter((x: any)=> x !== item);
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

  countQuantity(type: number){
    return this.listProducts.filter(product => product.productTypeId === type)
    .reduce((sum, product) => sum + product.quantity, 0);
  }

  sumQuantity(item: any){
    return item.reduce((sum: any, product: any) => (sum += Number(product.quantity)), 0);
  }

  addProduct(productTypeId: number){
    const exist = this.products.find((x:any)=> x.productId === this.product.productId);
    if(exist === undefined){
      this.products.push({...this.product, productTypeId });
      this.product = {
        productId:'',
        quantity:''
      }
    } else {
      this._toast.warning('Error', 'Ya existe una cantidad agregada para este producto')
    }
  }

  deleteProduct(item: any){
    this.products = this.products.filter((x:any)=> x.productId !== item.productId);
  }

  getNamePropuct(id: number){
    return this.listProducts.find((x: any)=> x.id === id).name;
  }

  // Abre la cámara y muestra el stream
  openCamera() {
    if(this.photos.length === 6){
      this._toast.info('Importante','Se permiten maximo 6 soportes adjuntos');
      return;
    }
    this.showCamera = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
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
      this.videoStream.getTracks().forEach(track => track.stop());
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
      this.photo = canvas.toDataURL('image/png');  // Convierte la imagen en base64
      this.photos.push({url:this.photo, id: new Date().getTime()});
    }

    this.closeCamera();  // Opcional: cerrar la cámara después de capturar la foto
  }

  openGallery() {
    if(this.photos.length === 6){
      this._toast.info('Importante','Se permiten maximo 6 soportes adjuntos');
      return;
    }
    const cameraInput = document.getElementById('cameraInput') as HTMLInputElement;
    cameraInput.click(); // Simula el click sobre el input para abrir la cámara
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Al completar la lectura del archivo, obtén el base64
      reader.onload = (e: any) => {
        const base64String = e.target.result; // El resultado será el base64
        this.photos.push({url:base64String, id: new Date().getTime()});; // Puedes almacenarlo en el array 'photos' o usarlo como necesites
      };

      // Lee el archivo como una URL en base64
      reader.readAsDataURL(file);
    }
  }

  viewPhoto(item: any){
    this.imageselect = item;
    this.modal.show();
  }

  deleteEvidence(item: any){
    this.photos = this.photos.filter((x: any)=> x.id !== item.id);
    this.modal.hide();
  }

  cancelShipments(){
    this.editpanel = false;
    this.action = 'listar';

  }

  base64ToBlob(base64: string, contentType: string = '', sliceSize: number = 512): Blob {
    const byteCharacters = atob(base64); // decodificar base64
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  confirmShipments(){
    if(this.photos.length === 0){
      this._toast.info('Importante', 'Debe adjuntar evidencias para el envio')
      return;
    }
    this.products = this.listProducts.reduce((acc, { id, quantity }) => {
      if (quantity > 0) {
        acc.push({ productId:id, quantity });
      }
      return acc;
    }, [])
    if(this.products.length === 0){
      this._toast.info('Importante', 'Debe indicar la cantidad de almenos un producto para el envio');
      return;
    }
    this.modalloading.show();
    const formData = new FormData();
    this.photos.map(item => ({url: item.url.replace(/^data:image\/[a-zA-Z]+;base64,/, '')})).forEach((base64String, index) => {
      // Aquí asumimos que son imágenes, puedes cambiar el 'image/png' según el tipo de archivo
      const blob = this.base64ToBlob(base64String.url, 'image/png');
      // Adjunta el blob al FormData, nombrando cada archivo con un índice u otro identificador
      formData.append(`file${index}`, blob, `image${index}.png`);
    });
    this.api.postWithReturnData(`files/upload`, formData).subscribe({
      next: (response: any) => {
        this.messageLoading = 'Enviando productos, por favor espera...'
        this.saveShipments(response);
      },
      error: (error: any) => {
        this.modalloading.hide();
        console.error('Error al subir archivos:', error);
      }
    });
  }

  saveShipments(photos: any[]){
    const data = {
      ...this.shipmentForm,
      licensePlate: this.shipmentForm.licensePlate.toUpperCase(),
      details: this.products,
      photos: photos,
    };
    this.api.post(`shipments`, data).subscribe({
      next: (response: any) => {
        this.editpanel = false;
        this.action = 'listar';
        this.getShipments(this.currentPage);
        this.modalloading.hide();
      },
      error: (error: any) => {
        this.modalloading.hide();
        console.error('Error al guardar la envio:', error);
      },
    });
  }

  // paginación
  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listShipping.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // this.updatePaginatedList();
      this.getShipments(page);
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
  onSearchChange(value: string): void {
    if (!value) {
      this.listShipping = [...this.listBase]; // Restablecer la lista original si no hay búsqueda
    } else {
      this.listShipping = this.listBase.filter((item: any) => {
        const itemValues: any = Object.values(item);
        return itemValues.some((val: string) =>
          String(val).toLowerCase().includes(value.toLowerCase())
        );
      });
    }
    this.currentPage = 1; // Reinicia a la primera página
    this.updatePaginatedList(); // Actualiza la lista paginada después del filtrado
  }
}
