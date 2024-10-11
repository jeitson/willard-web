import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZoneRoutingModule } from './zone-routing.module';
import { ZoneComponent } from './zone.component';
import { CatalogueModule } from 'src/app/components/catalogue/catalogue.module';


@NgModule({
  declarations: [
    ZoneComponent
  ],
  imports: [
    CommonModule,
    ZoneRoutingModule,
    CatalogueModule
  ]
})
export class ZoneModule { }
