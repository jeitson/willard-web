import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'requestplanner',
		loadChildren: () =>
			import('../process/requestplanner/requestplanner.module').then(
				({ RequestplannerModule }) => RequestplannerModule,
			),
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
