import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TypeevidenceComponent } from './typeevidence.component';

const routes: Routes = [
  {
    path:'',
    component: TypeevidenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypeevidenceRoutingModule { }
