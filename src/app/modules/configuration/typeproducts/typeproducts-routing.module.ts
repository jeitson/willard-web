import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeproductsComponent } from './typeproducts.component';

const routes: Routes = [
  {
    path:'',
    component: TypeproductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeproductsRoutingModule { }
