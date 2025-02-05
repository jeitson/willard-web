import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';

declare var bootstrap: any;
@Component({
  selector: 'app-conciliation',
  templateUrl: './conciliation.component.html',
  styleUrls: ['./conciliation.component.css']
})
export class ConciliationComponent implements OnInit {

  searchTerm: string = ''; // Para almacenar el texto de búsqueda
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 5; // Cantidad de elementos por página
  totalPages: number = 0; // Total de páginas
  totalItems = 0;
  paginatedList: any = [];
  listBase: any[] = [];
  modal: any;
  modalConfirm: any;
  listReceptions: any[] = [
    {
      guide: '9838823',
      createdAt: new Date(),
      zone: 'Norte',
      recuperadora: 'Los olivos',
      transporter:'Transportes Gato',
      cantTotal:130,
      glosa: 240.000
    }
  ];
  audit: any = {};
  images: any[] = [];
  viewdata = true;
  selectedOption: string = ''; // Para capturar la opción seleccionada (R o T)
  comment: string = '';
  constructor(private api: ApiService){
  }

  ngOnInit(){
    this.modal = new bootstrap.Modal(document.getElementById('modaldetail'), {backdrop: 'static', keyboard: false})
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalConfirm'), {backdrop: 'static', keyboard: false})
    this.getReceptions(this.currentPage);
  }

  getReceptions(item: any){
    this.api.get(`audit_guide?page=${item}`).subscribe({
      next: (response: any) => {
        this.listReceptions = response.data.items.sort((a: any, b: any) => b.id - a.id);;
        this.listBase = this.listReceptions; // Guardamos la lista original para filtrar
        this.totalItems = this.listReceptions.length; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de página
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  viewDetail(item: any[]){
    this.modal.show();
    this.audit = item;

    const shipments = this.audit.shipments;
    const auditsGuidesRoutes = this.audit.auditsGuidesRoutes;
    const arr = [...shipments, ...auditsGuidesRoutes].map(this.homogenizeStructure);
    this.audit.routes = arr;
  }

  homogenizeStructure = (item: any): any => {
    return {
      name: item.guideNumber ? item.collectionSite.name : item.transporterTravel.siteName, // Homologa `title` y `nombre` a `name`
      id: item.guideNumber ? item.id : item.auditGuideId, // Homologa `id` y `identificador` a `id`
      isAgency: item.guideNumber ? 'SI' : 'NO',
      type: item.guideNumber ? 'ENTREGA' : item.transporterTravel.type,
      date: item.guideNumber ? item.createdAt : item.transporterTravel.movementDate,
      quantity: item.guideNumber ? this.countProducts(item.shipmentDetails) : item.transporterTravel.totalQuantity,
      images: item.guideNumber ? item.shipmentPhotos.map((e: any)=>{return e.url}) : item.transporterTravel.supportUrls,
      // Agregar más propiedades según sea necesario
    };
  };

  viewFiles(images: any){
    this.viewdata = false;
    this.images = images;
  }

  countProducts(products: any): any {
    return products.reduce((acc: any, item: any) => acc += parseInt(item.quantity), 0)
  }

  syncGuide(item: any){
    this.api.post(`audit_guide/synchronize/${item.id}`).subscribe({
      next: (response: any) => {
        this.getReceptions(this.currentPage);        
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  setAnswer(){
    this.modal.hide();
    this.modalConfirm.show();
  }

  setColorStatus(status: any){
    let color = '';
    switch (status) {
      case '101': //sin guia
        color = 'bg-danger'
        break;
      case '102': //pendiente
        color = 'bg-warning';
        break;
      case '103': //confirmado
        color = 'bg-success'
        break;
      default:
        break;
    }
    return color;
  }

  actionConfirm(){
    const data =  {
      auditGuideDetails: [],
      giveReason: this.selectedOption || 'R', // Asigna la opción seleccionada
      comment: this.comment || '' // Asigna el comentario
    };
    this.api.post(`audit_guide/confirm/${this.audit.id}`).subscribe({
      next: (response: any) => {
        this.listReceptions = response.data.items;
        this.listBase = this.listReceptions; // Guardamos la lista original para filtrar
        this.totalItems = this.listReceptions.length; // Total de solicitudes
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage); // Total de página
      },
      error: (error: any) => {
        console.error('Error al crear usuario:', error);
      },
    });
  }

  // paginación
  onPageChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPage = Number(selectElement.value);
    this.goToPage(selectedPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }
  get pagesArray() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedList = this.listReceptions.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.listReceptions.length / this.itemsPerPage); // Calcula el total de páginas
  }
}
