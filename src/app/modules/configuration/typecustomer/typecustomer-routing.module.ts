import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypecustomerComponent } from './typecustomer.component';

const routes: Routes = [
  {
    path:'',
    component: TypecustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypecustomerRoutingModule { }
