import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { ToastService } from 'src/app/core/services/toast.service';

declare var bootstrap: any;
@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {

  @ViewChild('video', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  p:number = 1;
  totalItemsRender: number = 10;
  pagination: any = {};
  receptionForm = {
    transporterId:'',
    licensePlate:'',
    driver:'',
    guideNumber:'',
    referenceDoc1:'',
    referenceDoc2:'',
  }
  listTransporters: any[] = [];
  photos: any[] = [];
  listTypeProducts: any[] = [];
  listProducts: any[] = [];
  listReceptions: any[] = [];
  products: any[] = [];
  product: any = {
    productId:'',
    quantity:''
  }
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
  role: string = '';
  headacopi: any = '';
  constructor(private api: ApiService, private _toast: ToastService){}

  ngOnInit(){
    this.role = sessionStorage.getItem('RoleId') || '';
    this.headacopi = JSON.parse(sessionStorage.getItem('profileData') || '[]')?.collectionSites[0].collectionSite.name
    this.modal = new bootstrap.Modal(document.getElementById('modalevidence'), {backdrop: 'static', keyboard: false});
    this.modalloading = new bootstrap.Modal(document.getElementById('modalLoading'), {backdrop: 'static', keyboard: false});
    this.getReceptions();
    this.getTransporters();
    this.getProductType();
    this.getProducts();
  }

  getReceptions(){
    this.api.get(`receptions`).subscribe({
      next: (response: any) => {
        this.listReceptions = response.data.items;
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

  addReception(){
    this.photos = [];
    this.products.forEach(element => {
      return element.quantity = 0;
    });
    this.receptionForm = {
      transporterId:'',
      licensePlate:'',
      driver:'',
      guideNumber:'',
      referenceDoc1:'',
      referenceDoc2:'',
    }
    this.toggleSection(this.listTypeProducts[0].id || '');
    this.editpanel = true;
    this.action = 'agregar'
  }

  editReception(item: any){
    this.editpanel = true;
    this.action = 'actualizar'
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

  cancelReception(){
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

  confirmReception(){
    if(this.photos.length === 0){
      this._toast.info('Importante', 'Debe adjuntar evidencias para la recepción')
      return;
    }
    this.products = this.listProducts.reduce((acc, { id, quantity }) => {
      if (quantity > 0) {
        acc.push({ productId:id, quantity });
      }
      return acc;
    }, [])
    if(this.products.length === 0){
      this._toast.info('Importante', 'Debe indicar la cantidad de almenos un producto para la recepción');
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
        this.messageLoading = 'Recepcionando productos, por favor espera...'
        this.saveReception(response);
      },
      error: (error: any) => {
        this.modalloading.hide();
        console.error('Error al subir archivos:', error);
      }
    });
  }

  saveReception(photos: any[]){
    const data = {
      ...this.receptionForm,
      details: this.products,
      photos: photos,
    };
    this.api.post(`receptions`, data).subscribe({
      next: (response: any) => {
        this.editpanel = false;
        this.action = 'listar';
      },
      error: (error: any) => {
        this.modalloading.hide();
        console.error('Error al guardar la recepción:', error);
      },
      complete: ()=>{
        this.modalloading.hide();
      }
    });
  }




}
