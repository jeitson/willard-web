import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'customer',
		loadChildren: () =>
			import('./customers/customers.module').then(
				({ CustomersModule }) => CustomersModule,
			),
	},
	{
		path: 'collection',
		loadChildren: () =>
			import('./collection-centers/collection-centers.module').then(
				({ CollectionCentersModule }) => CollectionCentersModule,
			),
	},
	{
		path: 'product',
		loadChildren: () =>
			import('./product/product.module').then(
				({ ProductModule }) => ProductModule,
			),
	},
	{
		path: 'conveyor',
		loadChildren: () =>
			import('./conveyor/conveyor.module').then(
				({ ConveyorModule }) => ConveyorModule,
			),
	},
	{
		path: 'adviser',
		loadChildren: () =>
			import('./adviser/adviser.module').then(
				({ AdviserModule }) => AdviserModule,
			),
	},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
