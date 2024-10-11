import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestplannerComponent } from './requestplanner.component';
import { DetailrequestComponent } from './detailrequest/detailrequest.component';

const routes: Routes = [
  {
    path:'',
    component: RequestplannerComponent,
    // children:[

    // ]
  },
  {
    path:':id',
    component: DetailrequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestplannerRoutingModule { }
