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
  constructor(private api: ApiService){
  }

  ngOnInit(){
    this.modal = new bootstrap.Modal(document.getElementById('modaldetail'), {backdrop: 'static', keyboard: false})
    this.modalConfirm = new bootstrap.Modal(document.getElementById('modalConfirm'), {backdrop: 'static', keyboard: false})
    this.getReceptions(this.currentPage);
  }

  getReceptions(item: any){
    this.api.get(`audit_guia?page=${item}`).subscribe({
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

  viewDetail(item: any[]){
    this.modal.show();
    this.audit = item;
  }

  openModalConciliation(item: any[]){

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
