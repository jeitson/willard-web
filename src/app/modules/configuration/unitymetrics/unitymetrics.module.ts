import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitymetricsRoutingModule } from './unitymetrics-routing.module';
import { UnitymetricsComponent } from './unitymetrics.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    UnitymetricsComponent
  ],
  imports: [
    CommonModule,
    UnitymetricsRoutingModule,
    CatalogueModule
  ]
})
export class UnitymetricsModule { }
