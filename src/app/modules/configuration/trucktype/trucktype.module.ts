import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrucktypeRoutingModule } from './trucktype-routing.module';
import { TrucktypeComponent } from './trucktype.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    TrucktypeComponent
  ],
  imports: [
    CommonModule,
    TrucktypeRoutingModule,
    CatalogueModule
  ]
})
export class TrucktypeModule { }
