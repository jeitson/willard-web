import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'requestplanner',
		loadChildren: () =>
			import('../process/requestplanner/requestplanner.module').then(
				({ RequestplannerModule }) => RequestplannerModule,
			),
	},
	{
		path: 'requestagency',
		loadChildren: () =>
			import('../process/requestagency/requestagency.module').then(
				({ RequestagencyModule }) => RequestagencyModule,
			),
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
