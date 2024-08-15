import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
		path: 'roles',
		loadChildren: () =>
			import('./roles/roles.module').then(
				({ RolesModule }) => RolesModule,
			),
	},
  {
		path: 'users',
		loadChildren: () =>
			import('./users/users.module').then(
				({ UsersModule }) => UsersModule,
			),
	},
	{
		path: 'request',
		loadChildren: () =>
			import('./request-logs/request-logs.module').then(
				({ RequestLogsModule }) => RequestLogsModule,
			),
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityRoutingModule { }
