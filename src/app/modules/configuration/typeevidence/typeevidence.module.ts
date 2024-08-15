import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypeevidenceRoutingModule } from './typeevidence-routing.module';
import { TypeevidenceComponent } from './typeevidence.component';
import { CatalogueComponent } from 'src/app/components/catalogue/catalogue.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    TypeevidenceComponent
  ],
  imports: [
    CommonModule,
    TypeevidenceRoutingModule,
    CatalogueModule
  ]
})
export class TypeevidenceModule { }
