import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestlogisticsComponent } from './requestlogistics.component';

const routes: Routes = [
  {
    path:'',
    component: RequestlogisticsComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestlogisticsRoutingModule { }
