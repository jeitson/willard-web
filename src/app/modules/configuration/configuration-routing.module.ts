import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
		path: 'country',
		loadChildren: () =>
			import('./country/country.module').then(
				({ CountryModule }) => CountryModule,
			),
	},
  {
		path: 'department',
		loadChildren: () =>
			import('./department/department.module').then(
				({ DepartmentModule }) => DepartmentModule,
			),
	},
  {
		path: 'city',
		loadChildren: () =>
			import('./city/city.module').then(
				({ CityModule }) => CityModule,
			),
	},
  {
		path: 'headquartercopy',
		loadChildren: () =>
			import('./headquartercopy/headquartercopy.module').then(
				({ HeadquartercopyModule }) => HeadquartercopyModule,
			),
	},
  {
		path: 'locationdeparture',
		loadChildren: () =>
			import('./locationdeparture/locationdeparture.module').then(
				({ LocationdepartureModule }) => LocationdepartureModule,
			),
	},
  {
		path: 'typedocuments',
		loadChildren: () =>
			import('./typedocuments/typedocuments.module').then(
				({ TypedocumentsModule }) => TypedocumentsModule,
			),
	},
  {
		path: 'typeevidence',
		loadChildren: () =>
			import('./typeevidence/typeevidence.module').then(
				({ TypeevidenceModule }) => TypeevidenceModule,
			),
	},
  {
		path: 'typeguide',
		loadChildren: () =>
			import('./typeguide/typeguide.module').then(
				({ TypeguideModule }) => TypeguideModule,
			),
	},
  {
		path: 'typeproducts',
		loadChildren: () =>
			import('./typeproducts/typeproducts.module').then(
				({ TypeproductsModule }) => TypeproductsModule,
			),
	},
  {
		path: 'unitymetrics',
		loadChildren: () =>
			import('./unitymetrics/unitymetrics.module').then(
				({ UnitymetricsModule }) => UnitymetricsModule,
			),
	},
  {
		path: 'zone',
		loadChildren: () =>
			import('./zone/zone.module').then(
				({ ZoneModule }) => ZoneModule,
			),
	},
  {
		path: 'trucktype',
		loadChildren: () =>
			import('./trucktype/trucktype.module').then(
				({ TrucktypeModule }) => TrucktypeModule,
			),
	},
  {
		path: 'typecustomer',
		loadChildren: () =>
			import('./typecustomer/typecustomer.module').then(
				({ TypecustomerModule }) => TypecustomerModule,
			),
	},
  {
		path: 'routestatus',
		loadChildren: () =>
			import('./routestatus/routestatus.module').then(
				({ RoutestatusModule }) => RoutestatusModule,
			),
	},
  {
		path: 'customer',
		loadChildren: () =>
			import('../configuration/customers/customers.module').then(
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
			import('../configuration/product/product.module').then(
				({ ProductModule }) => ProductModule,
			),
	},
	{
		path: 'conveyor',
		loadChildren: () =>
			import('../configuration/conveyor/conveyor.module').then(
				({ ConveyorModule }) => ConveyorModule,
			),
	},
	{
		path: 'adviser',
		loadChildren: () =>
			import('../configuration/adviser/adviser.module').then(
				({ AdviserModule }) => AdviserModule,
			),
	},
	{
		path: 'pickuplocation',
		loadChildren: () =>
			import('../configuration/pickuplocation/pickuplocation.module').then(
				({ PickuplocationModule }) => PickuplocationModule,
			),
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
