import { Component } from '@angular/core';
declare var $: any;

@Component({
  selector: 'wlrd-requestlogistics',
  templateUrl: './requestlogistics.component.html',
  styleUrls: ['./requestlogistics.component.scss'],
})
export class RequestlogisticsComponent {

  request = {
    specialPlanner: '',
    changeRetriever: '',
    transporter: '',
    driver: '',
    estimatedKG: 0,
    isSpecial: false, // Asegúrate de que este valor se actualice según sea necesario en tu aplicación
  };


  specialPlanners = [
    { name: 'Planeador 1', id: 1 },
    { name: 'Planeador 2', id: 2 },
    { name: 'Planeador 3', id: 3 },
    // Agrega más planeadores especiales según sea necesario
  ];

  retrievers = [
    { name: 'Recuperador 1', id: 1 },
    { name: 'Recuperador 2', id: 2 },
    { name: 'Recuperador 3', id: 3 },
    // Agrega más recuperadores según sea necesario
  ];

  transporters = [
    { name: 'Transportador 1', id: 1 },
    { name: 'Transportador 2', id: 2 },
    { name: 'Transportador 3', id: 3 },
    // Agrega más transportadores según sea necesario
  ];

  drivers = [
    { name: 'Conductor 1', id: 1 },
    { name: 'Conductor 2', id: 2 },
    { name: 'Conductor 3', id: 3 },
    // Agrega más conductores según sea necesario
  ];

  action = {name: 'LOGISTICA'}

  createRequest() {
    // Lógica para crear la solicitud
    $('#modalRequest').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }
  viewRequest(){
    $('#modalDetail').modal({ backdrop: 'static', keyboard: false });
    console.log('Creando solicitud:', this.request);
  }
}
