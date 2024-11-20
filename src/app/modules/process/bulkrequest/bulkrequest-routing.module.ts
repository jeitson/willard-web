import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkrequestComponent } from './bulkrequest.component';

const routes: Routes = [
  {
    path:'',
    component: BulkrequestComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulkrequestRoutingModule { }
