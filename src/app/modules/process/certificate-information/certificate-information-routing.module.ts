import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateInformationComponent } from './certificate-information.component';

const routes: Routes = [
  {
    path:'',
    component: CertificateInformationComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CertificateInformationRoutingModule { }
