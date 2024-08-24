import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdviserComponent } from './adviser.component';

const routes: Routes = [
	{
		path: '',
		component: AdviserComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdviserRoutingModule { }
