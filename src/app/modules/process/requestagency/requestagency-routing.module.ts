import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestagencyComponent } from './requestagency.component';

const routes: Routes = [
  {
    path:'',
    component: RequestagencyComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestagencyRoutingModule { }
