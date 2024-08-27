import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickuplocationComponent } from './pickuplocation.component';

const routes: Routes = [
	{
		path: '',
		component: PickuplocationComponent,
	},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickuplocationRoutingModule { }
