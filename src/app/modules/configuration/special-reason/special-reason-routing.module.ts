import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecialReasonComponent } from './special-reason.component';

const routes: Routes = [
  {
    path:'',
    component: SpecialReasonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialReasonRoutingModule { }
