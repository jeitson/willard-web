import { Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'wlrd-requestagency',
  templateUrl: './requestagency.component.html',
  styleUrls: ['./requestagency.component.scss']
})
export class RequestagencyComponent {
  // constructor(private) {}
  action = { name: 'Crear' }; // o 'Actualizar' según el caso
  viewoptions = true; // true para crear, false para actualizar

  request = {
    clientId: null,
    pickUpLocationId: null,
    collectionSiteId: null,
    transportadoraId: null,
    consultantId: null,
    name: '',
    description: '',
    requestDate: '',
    requestTime: '',
    estimatedQuantity: null,
    estimatedKG: null,
    isSpecial: false,
    requestStatusId: null,
    estimatedPickUpDate: '',
    estimatedPickUpTime: '',
    observations: '',
    recommendations: '',
  };

  clients = [
    { id: 1, name: 'Cliente 1', nit: '1001101', agency: 'Agencia 1' },
    { id: 2, name: 'Cliente 2', nit: '2002202', agency: 'Agencia 2' },
    // Más clientes
  ];
  pickUpLocations = [
    { id: 1, name: 'Ubicación A' },
    { id: 2, name: 'Ubicación B' },
    // Más ubicaciones...
  ];

  collectionSites = [
    { id: 1, name: 'Sitio A' },
    { id: 2, name: 'Sitio B' },
    // Más sitios...
  ];

  transportadoras = [
    { id: 1, name: 'Transportadora A' },
    { id: 2, name: 'Transportadora B' },
    // Más transportadoras...
  ];

  consultants = [
    { id: 1, name: 'Consultor A' },
    { id: 2, name: 'Consultor B' },
    // Más consultores...
  ];

  requestStatuses = [
    { id: 1, name: 'Pendiente' },
    { id: 2, name: 'En Proceso' },
    { id: 3, name: 'Completado' },
    // Más estados...
  ];

  ngOnInit(): void {
  }

  createRequest() {
    // Lógica para crear la solicitud
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }

  updateRequest() {
    // Lógica para actualizar la solicitud
    console.log('Actualizando solicitud:', this.request);
  }


}
