import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionCentersComponent } from './collection-centers.component';

const routes: Routes = [
  {
    path: '',
    component: CollectionCentersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollectionCentersRoutingModule {}
