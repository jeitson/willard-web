import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestLogsComponent } from './request-logs.component';

const routes: Routes = [
	{
		path: '',
		component: RequestLogsComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestLogsRoutingModule { }
