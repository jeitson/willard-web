import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportFileComponent } from './report-file.component';

const routes: Routes = [
  {
    path:'',
    component: ReportFileComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFileRoutingModule { }
