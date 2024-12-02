import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliationComponent } from './conciliation.component';

const routes: Routes = [
  {
    path:'',
    component: ConciliationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConciliationRoutingModule { }
