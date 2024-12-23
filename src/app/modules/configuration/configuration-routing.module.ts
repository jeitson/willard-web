import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
		path: 'country',
		data: { reuse: false },
    loadChildren: () =>
			import('./country/country.module').then(
				({ CountryModule }) => CountryModule,
			),
	},
  {
		path: 'department',
		data: { reuse: false },
    loadChildren: () =>
			import('./department/department.module').then(
				({ DepartmentModule }) => DepartmentModule,
			),
	},
  {
		path: 'city',
		data: { reuse: false },
    loadChildren: () =>
			import('./city/city.module').then(
				({ CityModule }) => CityModule,
			),
	},
  {
		path: 'headquartercopy',
		data: { reuse: false },
    loadChildren: () =>
			import('./headquartercopy/headquartercopy.module').then(
				({ HeadquartercopyModule }) => HeadquartercopyModule,
			),
	},
  {
		path: 'specialreason',
		data: { reuse: false },
    loadChildren: () =>
			import('./special-reason/special-reason.module').then(
				({ SpecialReasonModule }) => SpecialReasonModule,
			),
	},
  {
		path: 'locationdeparture',
		data: { reuse: false },
    loadChildren: () =>
			import('./locationdeparture/locationdeparture.module').then(
				({ LocationdepartureModule }) => LocationdepartureModule,
			),
	},
  {
		path: 'typedocuments',
		data: { reuse: false },
    loadChildren: () =>
			import('./typedocuments/typedocuments.module').then(
				({ TypedocumentsModule }) => TypedocumentsModule,
			),
	},
  {
		path: 'typeevidence',
		data: { reuse: false },
    loadChildren: () =>
			import('./typeevidence/typeevidence.module').then(
				({ TypeevidenceModule }) => TypeevidenceModule,
			),
	},
  {
		path: 'typeguide',
		data: { reuse: false },
    loadChildren: () =>
			import('./typeguide/typeguide.module').then(
				({ TypeguideModule }) => TypeguideModule,
			),
	},
  {
		path: 'typeproducts',
		data: { reuse: false },
    loadChildren: () =>
			import('./typeproducts/typeproducts.module').then(
				({ TypeproductsModule }) => TypeproductsModule,
			),
	},
  {
		path: 'unitymetrics',
		data: { reuse: false },
    loadChildren: () =>
			import('./unitymetrics/unitymetrics.module').then(
				({ UnitymetricsModule }) => UnitymetricsModule,
			),
	},
  {
		path: 'zone',
		data: { reuse: false },
    loadChildren: () =>
			import('./zone/zone.module').then(
				({ ZoneModule }) => ZoneModule,
			),
	},
  {
		path: 'trucktype',
		data: { reuse: false },
    loadChildren: () =>
			import('./trucktype/trucktype.module').then(
				({ TrucktypeModule }) => TrucktypeModule,
			),
	},
  {
		path: 'typecustomer',
		data: { reuse: false },
    loadChildren: () =>
			import('./typecustomer/typecustomer.module').then(
				({ TypecustomerModule }) => TypecustomerModule,
			),
	},
  {
		path: 'routestatus',
		data: { reuse: false },
    loadChildren: () =>
			import('./routestatus/routestatus.module').then(
				({ RoutestatusModule }) => RoutestatusModule,
			),
	},
  {
		path: 'customer',
		data: { reuse: false },
    loadChildren: () =>
			import('../configuration/customers/customers.module').then(
				({ CustomersModule }) => CustomersModule,
			),
	},
	{
		path: 'collection',
		data: { reuse: false },
    loadChildren: () =>
			import('./collection-centers/collection-centers.module').then(
				({ CollectionCentersModule }) => CollectionCentersModule,
			),
	},
	{
		path: 'product',
		data: { reuse: false },
    loadChildren: () =>
			import('../configuration/product/product.module').then(
				({ ProductModule }) => ProductModule,
			),
	},
	{
		path: 'conveyor',
		data: { reuse: false },
    loadChildren: () =>
			import('../configuration/conveyor/conveyor.module').then(
				({ ConveyorModule }) => ConveyorModule,
			),
	},
	{
		path: 'adviser',
		data: { reuse: false },
    loadChildren: () =>
			import('../configuration/adviser/adviser.module').then(
				({ AdviserModule }) => AdviserModule,
			),
	},
	{
		path: 'pickuplocation',
		data: { reuse: false },
    loadChildren: () =>
			import('../configuration/pickuplocation/pickuplocation.module').then(
				({ PickuplocationModule }) => PickuplocationModule,
			),
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigurationRoutingModule { }
