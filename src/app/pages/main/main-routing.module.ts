import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { environment } from 'src/environments/environment';
import { RoleGuard } from 'src/app/core/guards/role.guard';

const app_name: string = environment.app_name;

const canAccess: CanActivateFn = (route, state) => {
  const roleGuard = inject(RoleGuard);
  const expectedRoles = route.data?.['expectedRoles'];
  return roleGuard.canAccess(expectedRoles);
};

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		children: [
      {
        path: 'dashboard',
        title: `${app_name}® - Dashboard`,
        loadChildren: () =>
					import('./../../modules/dashboard/dashboard.module').then(
						({ DashboardModule }) => DashboardModule,
				),
        //canActivate: [canAccess],
        // data: {
        //   expectedRoles: ['portalcli_client', 'none'],
        // },
      },
      {
        path: 'security',
        title: `${app_name}® - Security`,
        loadChildren: () =>
					import('./../../modules/security/security.module').then(
						({ SecurityModule }) => SecurityModule,
				),
        //canActivate: [canAccess],
        // data: {
        //   expectedRoles: ['portalcli_client', 'none'],
        // },
      },
      {
        path: 'settings',
        title: `${app_name}® - Configuración`,
        loadChildren: () =>
					import('./../../modules/configuration/configuration.module').then(
						({ ConfigurationModule }) => ConfigurationModule,
				),
        //canActivate: [canAccess],
      },
      {
        path: 'process',
        title: `${app_name}® - Proceso`,
        loadChildren: () =>
					import('./../../modules/process/process.module').then(
						({ ProcessModule }) => ProcessModule,
				),
        //canActivate: [canAccess],
        // data: {
        //   expectedRoles: ['portalcli_client', 'none'],
        // },
      },

		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MainRoutingModule {}
