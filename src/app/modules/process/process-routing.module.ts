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
	},
	{
		path: 'requestlogistics',
		loadChildren: () =>
			import('../process/requestlogistics/requestlogistics.module').then(
				({ RequestlogisticsModule }) => RequestlogisticsModule,
			),
	},
  {
		path: 'reception',
		loadChildren: () =>
			import('../process/reception/reception.module').then(
				({ ReceptionModule }) => ReceptionModule,
			),
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
