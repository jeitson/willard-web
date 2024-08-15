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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
