import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeadquartercopyComponent } from './headquartercopy.component';

const routes: Routes = [
  {
    path:'',
    component: HeadquartercopyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeadquartercopyRoutingModule { }
