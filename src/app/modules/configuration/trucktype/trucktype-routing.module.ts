import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrucktypeComponent } from './trucktype.component';

const routes: Routes = [
  {
    path:'',
    component: TrucktypeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrucktypeRoutingModule { }
