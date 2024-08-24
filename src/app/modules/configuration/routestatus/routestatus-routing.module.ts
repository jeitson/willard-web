import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutestatusComponent } from './routestatus.component';

const routes: Routes = [
  {
    path:'',
    component: RoutestatusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutestatusRoutingModule { }
