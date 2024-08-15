import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitymetricsComponent } from './unitymetrics.component';

const routes: Routes = [
  {
    path:'',
    component: UnitymetricsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitymetricsRoutingModule { }
