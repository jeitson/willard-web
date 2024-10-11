import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationdepartureComponent } from './locationdeparture.component';

const routes: Routes = [
  {
    path:'',
    component: LocationdepartureComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationdepartureRoutingModule { }
